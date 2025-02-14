"""
    fdm_dissorder(acc_order::Integer)

Calculate the order of dissipation needed for a given finite difference accuracy order [Babiuc:2007vr](@cite).
For a scheme of accuracy order 2r-2, returns dissipation order 2r.
"""
function fdm_dissorder(acc_order::Integer)
    @argcheck iseven(acc_order) "Only even orders are supported."
    r = div(acc_order + 2, 2)
    return 2r
end

"""
    fdm_disswts([TR=Rational{Int}], diss_order::Integer)

Calculate the weights for Kreiss-Oliger dissipation of given order [Babiuc:2007vr](@cite).
"""
function fdm_disswts(::Type{TR}, diss_order::Integer) where {TR<:Real}
    @argcheck iseven(diss_order) "Only even orders are supported."
    r = div(diss_order, 2)
    wts = fdm_centralwts(TR, diss_order, 2)
    @.. wts = (-1)^(r + 1) * wts / 2^(2 * r)
    return wts
end

function fdm_disswts(diss_order::TI) where {TI<:Integer}
    return fdm_disswts(Rational{TI}, diss_order)
end

"""
    fdm_disswts_bound([TR=Rational{Int}], diss_order::Integer)

Calculate the weights for Kreiss-Oliger dissipation of given order at the boundary [Babiuc:2007vr](@cite).
"""
function fdm_disswts_bound(::Type{TR}, diss_order::Integer) where {TR<:Real}
    @argcheck iseven(diss_order) "Only even orders are supported."
    r = div(diss_order, 2)
    wts_left, wts_right = fdm_boundwts(TR, diss_order, 2)
    @.. wts_left = (-1)^(r + 1) * wts_left / 2^(2 * r)
    @.. wts_right = (-1)^(r + 1) * wts_right / 2^(2 * r)

    return wts_left, wts_right
end

function fdm_disswts_bound(diss_order::TI) where {TI<:Integer}
    return fdm_disswts_bound(Rational{TI}, diss_order)
end

export fdm_dissorder, fdm_disswts, fdm_disswts_bound
