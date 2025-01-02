using FillArrays: OneElement

"""
    cheb2_coeffs_intmat([TR=Float64], n::Integer)
    cheb2_coeffs_intmat([TR=Float64], n::Integer, x_min::TR, x_max::TR)

Generate the Chebyshev coefficient integration matrix for spectral integration.

# Arguments
- `TR`: Type parameter for the matrix elements (e.g., Float64)
- `n`: Size of the matrix (n×n)
- `x_min`: (Optional) Lower bound of the integration interval
- `x_max`: (Optional) Upper bound of the integration interval

# Returns
- `Matrix{TR}`: The integration matrix B (n×n)

# Mathematical Background
The integration matrix B operates on Chebyshev spectral coefficients to compute
the coefficients of the indefinite integral. For a function expressed in the 
Chebyshev basis:

```math
f(x) = \\sum_{k=0}^{N-1} a_k T_k(x)
```

The indefinite integral's coefficients ``b_k`` in:

```math
\\int f(x)\\,dx = \\sum_{k=0}^{N-1} b_k T_k(x) + C
```

are computed using the matrix B: ``b = Ba``

The matrix elements are derived from the integration relation of Chebyshev polynomials:
```math
\\int T_n(x)\\,dx = \\frac{1}{2}\\left(\\frac{T_{n+1}(x)}{n+1} - \\frac{T_{n-1}(x)}{n-1}\\right)
```

When `x_min` and `x_max` are provided, the matrix is scaled for integration over [x_min, x_max].

See also: [`cheb2_pts`](@ref), [`cheb2_amat`](@ref), [`cheb2_smat`](@ref)
"""
function cheb2_coeffs_intmat(::Type{TR}, n::TI) where {TR<:AbstractFloat,TI<:Integer}
    nm1 = n - 1

    B = zeros(TR, n, n)

    @inbounds begin
        B[1, 1] = 1
        B[1, 2] = -one(TR) / 4
        B[2, 1] = 1
        B[2, 3] = -one(TR) / 2
        B[3, 2] = one(TR) / 4
    end

    @inbounds for i in 3:nm1
        # upper diagonal
        B[i, i + 1] = -one(TR) / (2 * (i - 1))

        # lower diagonal
        B[i + 1, i] = one(TR) / (2 * i)

        # first row
        c = i % 2 == 0 ? -1 : 1
        B[1, i] = c * (B[i - 1, i] + B[i + 1, i])
    end

    # fix B[end-1, end]
    @inbounds B[end - 1, end] += one(TR) / (2 * n)
    @inbounds B[1, end] = (nm1 % 2 == 0 ? 1 : -1) * B[end - 1, end]

    return B
end

function cheb2_coeffs_intmat(n::TI) where {TI<:Integer}
    return cheb2_coeffs_intmat(Float64, n)
end

# Second method documentation is inherited from the main docstring
function cheb2_coeffs_intmat(
    ::Type{TR}, n::TI, x_min::TR, x_max::TR
) where {TR<:AbstractFloat,TI<:Integer}
    B = cheb2_coeffs_intmat(TR, n)
    B .*= (x_max - x_min) / 2
    return B
end

function cheb2_coeffs_intmat(n::TI, x_min::Float64, x_max::Float64) where {TI<:Integer}
    return cheb2_coeffs_intmat(Float64, n, x_min, x_max)
end

function cheb2_intmat_asmat(::Type{TR}, n::TI) where {TR<:AbstractFloat,TI<:Integer}
    A = cheb2_amat(TR, n)
    S = cheb2_smat(TR, n)
    B = cheb2_coeffs_intmat(TR, n)
    return S * B * A
end

function cheb2_intmat_asmat(
    ::Type{TR}, n::TI, x_min::TR, x_max::TR
) where {TR<:AbstractFloat,TI<:Integer}
    A = cheb2_amat(TR, n)
    S = cheb2_smat(TR, n)
    B = cheb2_coeffs_intmat(TR, n, x_min, x_max)
    return S * B * A
end

"""
    cheb2_intmat([TR=Float64], n::Integer)
    cheb2_intmat([TR=Float64], n::Integer, x_min::TR, x_max::TR)

Generate the Chebyshev integration matrix that operates directly on function values.

# Arguments
- `TR`: Type parameter for the matrix elements (e.g., Float64)
- `n`: Size of the matrix (n×n)
- `x_min`: (Optional) Lower bound of the integration interval
- `x_max`: (Optional) Upper bound of the integration interval

# Returns
- `Matrix{TR}`: The integration matrix that operates on function values

# Mathematical Background
This matrix directly computes the indefinite integral of a function from its values
at Chebyshev points. For a function ``f(x)``, the integral is computed as:

```math
\\int f(x)\\,dx = \\mathbf{I}f
```

where ``\\mathbf{I} = S B A`` is the integration matrix composed of:
- ``A``: Analysis matrix (transform to spectral coefficients)
- ``B``: Coefficient integration matrix
- ``S``: Synthesis matrix (transform back to physical space)

This composition allows integration in physical space through:
1. Transform to spectral space (A)
2. Integrate coefficients (B)
3. Transform back to physical space (S)

# Examples
```julia
# Generate 8×8 integration matrix for [-1,1]
I = cheb2_intmat(Float64, 8)

# Get function values at Chebyshev points
x = cheb2_pts(Float64, 8)
f = sin.(x)

# Compute indefinite integral (-cos(x) + C)
F = I * f

# Integration matrix for [0,π]
I_scaled = cheb2_intmat(Float64, 8, 0.0, π)
```

See also: [`cheb2_coeffs_intmat`](@ref), [`cheb2_asmat`](@ref), [`cheb2_pts`](@ref)
"""
function cheb2_intmat(::Type{TR}, n::TI) where {TR<:AbstractFloat,TI<:Integer}
    # Build Lagrange basis
    K = Array{TR}(undef, n + 1, n)
    vals2coeffs_op = Cheb2Vals2CoeffsOp(TR, n)
    @inbounds for i in 1:n
        K[1:(end - 1), i] = vals2coeffs_op(OneElement(one(TR), i, n))
    end

    # Integrate
    cumsum_op = ChebCumsumOp(TR, n)
    @inbounds for i in 1:n
        K[:, i] = cumsum_op(@view(K[1:(end - 1), i]))
    end

    # Evaluate at grid
    xn = cheb2_pts(n)
    intmat = Array{TR}(undef, n, n)
    @inbounds for j in 1:n, i in 1:n
        intmat[i, j] = cheb_feval(@view(K[:, j]), xn[i])
    end

    return intmat
end

function cheb2_intmat(n::TI) where {TI<:Integer}
    return cheb2_intmat(Float64, n)
end

# Second method documentation is inherited from the main docstring
function cheb2_intmat(
    ::Type{TR}, n::TI, x_min::TR, x_max::TR
) where {TR<:AbstractFloat,TI<:Integer}
    intmat = cheb2_intmat(TR, n)
    intmat .*= (x_max - x_min) / 2
    return intmat
end

function cheb2_intmat(n::TI, x_min::Float64, x_max::Float64) where {TI<:Integer}
    return cheb2_intmat(Float64, n, x_min, x_max)
end

export cheb2_coeffs_intmat, cheb2_intmat

@testset "cheb2_intmat" begin
    n = 4
    intmat = cheb2_intmat(n)
    intmat_ana = [
        -1.73472347597681e-17 -2.08166817117217e-17 2.08166817117217e-17 3.46944695195361e-18
        0.204861111111111 0.326388888888889 -0.0486111111111111 0.0173611111111111
        0.0937500000000000 0.937500000000000 0.562500000000000 -0.0937500000000000
        0.111111111111111 0.888888888888889 0.888888888888889 0.111111111111111
    ]
    @test intmat ≈ intmat_ana rtol = 1e-12

    n = 5
    intmat = cheb2_intmat(n)
    intmat_ana = [
        -3.46944695195361e-18 1.38777878078145e-17 2.08166817117217e-17 -6.93889390390723e-18 0
        0.119403559372885 0.190063432038124 -0.0242640687119285 0.0132867367414871 -0.00559644062711508
        0.0333333333333333 0.620220057259940 0.400000000000000 -0.0868867239266071 0.0333333333333333
        0.0722631072937817 0.520046596591846 0.824264068711929 0.343269901295209 -0.0527368927062182
        0.0666666666666667 0.533333333333333 0.800000000000000 0.533333333333333 0.0666666666666667
    ]

    @test intmat ≈ intmat_ana rtol = 1e-12

    @testset "Compare direct vs coefficient-based integration" begin
        for n in [4, 8, 16, 32]
            # Test on standard domain [-1,1]
            I1 = cheb2_intmat(Float64, n)
            I2 = cheb2_intmat_asmat(Float64, n)
            @test I1 ≈ I2 rtol = 1e-12

            # Test on mapped domain [0,π]
            I1 = cheb2_intmat(Float64, n, 0.0, Float64(π))
            I2 = cheb2_intmat_asmat(Float64, n, 0.0, Float64(π))
            @test I1 ≈ I2 rtol = 1e-12
        end
    end
end

@testset "cheb2_intmat - analytical" begin
    @testset "Standard domain [-1,1]" begin
        n = 32
        x = cheb2_pts(Float64, n)
        intmat = cheb2_intmat(Float64, n)

        # Test 1: Polynomial integration
        f = @. x^3  # f(x) = x³
        F_numeric = intmat * f   # Should give (x⁴ - 1) / 4
        F_exact = @. (x^4 - 1) / 4
        @test F_numeric ≈ F_exact rtol = 1e-12

        # Test 2: Trigonometric integration
        f = @. sin(π * x)
        F_numeric = intmat * f   # Should give -(cos(πx)+1)/π
        F_exact = @. -(cos(π * x) + 1) / π
        @test F_numeric ≈ F_exact rtol = 1e-12
    end

    @testset "Mapped domain [0,π]" begin
        n = 32
        intmat = cheb2_intmat(Float64, n, 0.0, Float64(π))
        x = cheb2_pts(Float64, n, 0.0, Float64(π))

        # Test: Integration of sin(x) from 0 to x
        f = sin.(x)
        F_numeric = intmat * f   # Should give -cos(x) + 1
        F_exact = @. -cos(x) + 1
        @test F_numeric ≈ F_exact rtol = 1e-12

        # Test: Integration of x*cos(x)
        f = @. x * cos(x)
        F_numeric = intmat * f   # Should give x*sin(x) - sin(x)
        F_exact = @. x * sin(x) + cos(x) - 1
        @test F_numeric ≈ F_exact rtol = 1e-12
    end
end
