"""
    cheb1_barywts([TR=Float64], n::TI) where {TR<:AbstractFloat,TI<:Integer}

Compute the barycentric weights for Chebyshev points of the 1st kind.

# Arguments
- `TR`: Type parameter for the weights (e.g., Float64)
- `n`: Number of points

# References

- [berrut2004barycentric](@citet*)
- [chebfun/@chebtech1/barywts.m at master · chebfun/chebfun](https://github.com/chebfun/chebfun/blob/master/%40chebtech1/barywts.m)

See also: [`bary`](@ref), [`cheb1_pts`](@ref)
"""
function cheb1_barywts(::Type{TR}, n::TI) where {TR<:AbstractFloat,TI<:Integer}
    # Handle corner cases
    if n == 0
        return TR[]
    elseif n == 1
        return [one(TR)]
    end

    half = one(TR) / 2
    pi_over_n = convert(TR, π) / n
    v = Vector{TR}(undef, n)
    @inbounds for j in 0:(n - 1)
        θ = (n - j - half) * pi_over_n
        v[j + 1] = sin(θ)
    end

    # The following flipping trick forces symmetry. Also due to the nature of 
    # the sine function, those computed with a big argument are replaced by ones
    # with a small argument, improving the relative accuracy.
    half_n = floor(Int, n / 2)
    # Copy values from end to beginning for symmetry
    @inbounds for i in 1:half_n
        v[i] = v[n - i + 1]
    end

    # Flip signs for odd indices
    @inbounds for i in (n - 1):-2:1
        v[i] = -v[i]
    end

    return v
end

function cheb1_barywts(n::TI) where {TI<:Integer}
    return cheb1_barywts(Float64, n)
end

export cheb1_barywts
