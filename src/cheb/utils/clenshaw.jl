"""
    cheb_clenshaw(c::VT, x::T) where {T<:AbstractFloat,VT<:AbstractVector{T}}

Evaluate Chebyshev coefficients at a point using Clenshaw's algorithm.

# Arguments
- `c`: Vector of Chebyshev coefficients ``[c_0, c_1, \\ldots, c_n]``
- `x`: Evaluation point in [-1,1]

# References
- [chebfun/@chebtech/clenshaw.m at master · chebfun/chebfun](https://github.com/chebfun/chebfun/blob/master/%40chebtech/clenshaw.m)
"""
function cheb_clenshaw(c::VT, x::T) where {T<:AbstractFloat,VT<:AbstractVector{T}}
    @argcheck length(c) > 0 "c must have at least one element"

    x = 2 * x

    bk1 = zero(T)
    bk2 = zero(T)

    n = length(c) - 1

    @inbounds for k in (n + 1):-2:3
        bk2 = c[k] + x * bk1 - bk2
        bk1 = c[k - 1] + x * bk2 - bk1
    end

    # If n is odd, perform the extra step
    if isodd(n)
        tmp = deepcopy(bk1)
        @inbounds bk1 = c[2] + x * bk1 - bk2
        bk2 = tmp
    end

    # Compute the final value
    @inbounds y = c[1] + x * bk1 / 2 - bk2

    return y
end

@testset "cheb_clenshaw" begin
    tol = 10 * eps()

    @testset "Single coefficient tests" begin
        # Scalar evaluation
        c = [sqrt(2)]
        v = cheb_clenshaw(c, 0.0)
        @test v ≈ sqrt(2)

        # Vector evaluation
        x = [-0.5, 1.0]
        v = map(xi -> cheb_clenshaw(c, xi), x)
        @test all(v .≈ sqrt(2))
    end

    @testset "Vector coefficient tests" begin
        # Simple polynomial test
        c = collect(5.0:-1:1)
        x = [-0.5, -0.1, 1.0]

        v = map(xi -> cheb_clenshaw(c, xi), x)
        v_true = [3.0, 3.1728, 15.0]
        @test norm(v - v_true, Inf) < tol

        # Multiple polynomials
        c2 = reverse(c)
        v = map(xi -> [cheb_clenshaw(c, xi), cheb_clenshaw(c2, xi)], x)
        v_true = [
            3.0 0.0
            3.1728 3.6480
            15.0 15.0
        ]
        @test norm(hcat(v...)' - v_true, Inf) < tol
    end

    @testset "Edge cases" begin
        # Empty coefficient vector
        @test_throws ArgumentError cheb_clenshaw(Float64[], 0.0)

        # Single coefficient
        @test cheb_clenshaw([1.0], 0.5) ≈ 1.0
    end
end
