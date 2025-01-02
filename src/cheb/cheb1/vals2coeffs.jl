"""
    cheb1_vals2coeffs(vals::VT) where {TR<:AbstractFloat,VT<:AbstractVector{TR}}
    op::Cheb1Vals2CoeffsOp(vals::VT) where {TR<:AbstractFloat,VT<:AbstractVector{TR}}

Convert values at Chebyshev points of the 1st kind into Chebyshev coefficients.

# Performance Guide
For best performance, especially in loops or repeated calls:
```julia
op = Cheb1Vals2CoeffsOp(Float64, n)
values = op(coeffs)
```

# References
- [chebfun/@chebtech1/vals2coeffs.m at master · chebfun/chebfun](https://github.com/chebfun/chebfun/blob/master/%40chebtech1/vals2coeffs.m)
"""
struct Cheb1Vals2CoeffsOp{TR<:AbstractFloat,TP<:Plan}
    w::Vector{Complex{TR}}
    tmp::Vector{Complex{TR}}
    coeffs::Vector{TR}
    ifft_plan::TP

    function Cheb1Vals2CoeffsOp(::Type{TR}, n::TI) where {TR<:AbstractFloat,TI<:Integer}
        # Precompute weights
        w = Vector{Complex{TR}}(undef, n)
        @inbounds begin
            im_pi_over_2n = im * convert(TR, π) / (2n)
            for k in 0:(n - 1)
                w[k + 1] = 2 * exp(k * im_pi_over_2n)
            end
            w[1] /= 2  # Special case for k=0
        end

        # Prepare temporary array for FFT
        tmp = Vector{Complex{TR}}(undef, 2n)
        coeffs = Vector{TR}(undef, n)

        # Create an inverse FFT plan with MEASURE flag for better performance
        ifft_plan = plan_ifft_measure!(tmp)

        return new{TR,typeof(ifft_plan)}(w, tmp, coeffs, ifft_plan)
    end

    function Cheb1Vals2CoeffsOp(n::TI) where {TI<:Integer}
        return Cheb1Vals2CoeffsOp(Float64, n)
    end
end

function (op::Cheb1Vals2CoeffsOp{TR,TP})(
    vals::AbstractVector{TR}
) where {TR<:AbstractFloat,TP<:Plan}
    n = length(vals)
    if n <= 1
        op.coeffs .= vals
        return op.coeffs
    end

    # Check for symmetry with tolerance
    atol = 10 * eps(TR)
    isEven = true
    isOdd = true
    @inbounds for i in 1:(n ÷ 2)
        diff = abs(vals[i] - vals[n - i + 1])
        sum = abs(vals[i] + vals[n - i + 1])
        if diff > atol
            isEven = false
        end
        if sum > atol
            isOdd = false
        end
        if !isEven && !isOdd
            break
        end
    end

    # Build tmp as [reverse(vals); vals] more efficiently
    @inbounds begin
        for i in 1:n
            op.tmp[i] = Complex{TR}(vals[n - i + 1])
            op.tmp[n + i] = Complex{TR}(vals[i])
        end
    end

    # Apply IFFT
    op.ifft_plan * op.tmp

    # Extract and scale coefficients
    @inbounds begin
        for k in 1:n
            op.coeffs[k] = real(op.tmp[k] * op.w[k])
        end
    end

    # Enforce symmetry if detected
    if isEven || isOdd
        @inbounds begin
            k_start = isEven ? 2 : 1
            op.coeffs[k_start:2:n] .= 0
        end
    end

    return op.coeffs
end

function cheb1_vals2coeffs(vals::VT) where {TR<:AbstractFloat,VT<:AbstractVector{TR}}
    n = length(vals)
    if n <= 1
        return deepcopy(vals)
    end

    op = Cheb1Vals2CoeffsOp(TR, n)
    return op(vals)
end

export cheb1_vals2coeffs, Cheb1Vals2CoeffsOp

@testset "cheb1_vals2coeffs" begin
    tol = 100 * eps()

    @testset "Single value conversion" begin
        v = sqrt(2)
        c = cheb1_vals2coeffs([v])
        @test v ≈ c[1]
    end

    @testset "Even case tests" begin
        v = Float64[1:6;]
        cTrue = [
            7 / 2,
            sqrt(6) / 2 + 5 * sqrt(2) / 6,
            0,
            sqrt(2) / 6,
            0,
            sqrt(6) / 2 - 5 * sqrt(2) / 6,
        ]
        c = cheb1_vals2coeffs(v)
        @test norm(c - cTrue, Inf) < tol
        @test all(x -> abs(imag(x)) < tol, c)
    end

    @testset "Odd case tests" begin
        v = Float64[1:5;]
        cTrue = [
            3,
            (2 / 5) * (sqrt((5 - sqrt(5)) / 2) + 2 * sqrt((5 + sqrt(5)) / 2)),
            0,
            (2 / 5) * (2 * sqrt((5 - sqrt(5)) / 2) - sqrt((5 + sqrt(5)) / 2)),
            0,
        ]
        c = cheb1_vals2coeffs(v)
        @test norm(c - cTrue, Inf) < tol
        @test all(x -> abs(imag(x)) < tol, c)
    end

    @testset "Operator style" begin
        n = 100
        vals = rand(n)
        op = Cheb1Vals2CoeffsOp(n)

        # Test operator call
        coeffs1 = op(vals)
        coeffs2 = cheb1_vals2coeffs(vals)
        @test maximum(abs.(coeffs1 .- coeffs2)) < tol

        # Test multiple calls
        for _ in 1:10
            vals = rand(n)
            coeffs1 = op(vals)
            coeffs2 = cheb1_vals2coeffs(vals)
            @test maximum(abs.(coeffs1 .- coeffs2)) < tol
        end
    end
end