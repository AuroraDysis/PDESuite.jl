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
    fdm_disswts(diss_order::Integer)

Calculate the weights for Kreiss-Oliger dissipation of given order [Babiuc:2007vr](@cite).
"""
function fdm_disswts(diss_order::TI) where {TI<:Integer}
    @argcheck iseven(diss_order) "Only even orders are supported."
    r = div(diss_order, 2)
    local_grid = collect(Rational{TI}, (-r):r)
    wts = fdm_fornbergwts(2r, zero(Rational{TI}), local_grid)
    wts = (-1)^(r + 1) * wts//2^(2 * r)
    return wts
end

export fdm_dissorder, fdm_disswts
