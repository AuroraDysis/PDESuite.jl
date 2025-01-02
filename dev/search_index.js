var documenterSearchIndex = {"docs":
[{"location":"cheb/#Chebyshev-Suite","page":"Chebyshev Suite","title":"Chebyshev Suite","text":"","category":"section"},{"location":"cheb/","page":"Chebyshev Suite","title":"Chebyshev Suite","text":"Modules = [PDESuite.ChebyshevSuite]","category":"page"},{"location":"cheb/","page":"Chebyshev Suite","title":"Chebyshev Suite","text":"Modules = [PDESuite.ChebyshevSuite]","category":"page"},{"location":"cheb/#PDESuite.ChebyshevSuite.Cheb1Coeffs2ValsOp","page":"Chebyshev Suite","title":"PDESuite.ChebyshevSuite.Cheb1Coeffs2ValsOp","text":"cheb1_coeffs2vals(coeffs::Vector{TR}) where {TR<:AbstractFloat}\nop::Cheb1Coeffs2ValsOp{TR}(coeffs::Vector{TR}) -> Vector{TR}\n\nConvert Chebyshev coefficients to values at Chebyshev points of the 1st kind.\n\nPerformance Guide\n\nFor best performance, especially in loops or repeated calls:\n\n# Create operator\nop = Cheb1Coeffs2ValsOp(Float64, n)\n\n# Operator-style\nvalues = op(coeffs)\n\nMathematical Background\n\nThe function implements the transform from coefficient space to physical space for Chebyshev polynomials of the 1st kind Tₙ(x). The transformation:\n\nUses the relationship between Chebyshev polynomials and cosine series\nApplies a type-III discrete cosine transform via FFT\nPreserves polynomial symmetries:\nEven coefficients produce even functions\nOdd coefficients produce odd functions\n\nSee also: Cheb1Vals2CoeffsOp\n\n\n\n\n\n","category":"type"},{"location":"cheb/#PDESuite.ChebyshevSuite.Cheb1Vals2CoeffsOp","page":"Chebyshev Suite","title":"PDESuite.ChebyshevSuite.Cheb1Vals2CoeffsOp","text":"cheb1_vals2coeffs(vals::Vector{TR}) where {TR<:AbstractFloat}\nop::Cheb1Vals2CoeffsOp{TR}(vals::Vector{TR}) -> Vector{TR}\n\nConvert values sampled at Chebyshev points of the 1st kind into their corresponding Chebyshev coefficients.\n\nPerformance Guide\n\nFor optimal performance when performing multiple transformations:\n\nCreate a reusable operator outside your computation loop\nUse the operator-style call syntax inside the loop\n\nDescription\n\nGiven an input vector vals of length n representing function values at Chebyshev points of the 1st kind, this computes the Chebyshev coefficients c such that:\n\nf(x) = c[1]*T₀(x) + c[2]*T₁(x) + ... + c[n]*Tₙ₋₁(x)\n\nwhere Tₖ(x) are the Chebyshev polynomials of the 1st kind.\n\nArguments\n\nvals::Vector{TR}: Values at Chebyshev points of the 1st kind\nop::Cheb1Vals2CoeffsOp{TR}: Pre-allocated operator for transformation\n\nReturns\n\nVector of Chebyshev coefficients\n\nExamples\n\n# Single transformation\nvals = [1.0, 2.0, 3.0]\ncoeffs = cheb1_vals2coeffs(vals)\n\n# Multiple transformations (recommended for performance)\nn = length(vals)\nop = Cheb1Vals2CoeffsOp{Float64}(n)\n\n# Operator-style usage for best performance\nfor i in 1:100\n    coeffs = op(vals)\n    # ... use coeffs ...\nend\n\nReferences\n\nSection 4.7 of \"Chebyshev Polynomials\" by Mason & Handscomb, Chapman & Hall/CRC (2003).\n\n\n\n\n\n","category":"type"},{"location":"cheb/#PDESuite.ChebyshevSuite.Cheb2Coeffs2ValsOp","page":"Chebyshev Suite","title":"PDESuite.ChebyshevSuite.Cheb2Coeffs2ValsOp","text":"Cheb2Coeffs2ValsOp{TR<:AbstractFloat,TP<:Plan}\n\nA pre-planned operator for efficient conversion from Chebyshev coefficients to values.\n\nFields\n\ntmp::Vector{Complex{TR}}: Temporary storage for FFT computation\nvals::Vector{TR}: Storage for the resulting values\nfft_plan::TP: Pre-computed FFT plan for efficient transformation\n\nThis struct provides a reusable transformation operator that avoids repeated memory allocation and FFT plan creation when performing multiple transformations of the same size.\n\n\n\n\n\n","category":"type"},{"location":"cheb/#PDESuite.ChebyshevSuite.Cheb2Coeffs2ValsOp-Union{Tuple{TP}, Tuple{VT}, Tuple{TR}} where {TR<:AbstractFloat, VT<:AbstractVector{TR}, TP<:AbstractFFTs.Plan}","page":"Chebyshev Suite","title":"PDESuite.ChebyshevSuite.Cheb2Coeffs2ValsOp","text":"(op::Cheb2Coeffs2ValsOp{TR,TP})(coeffs::VT)\n\nApply the Chebyshev coefficient to values transformation using a pre-planned operator.\n\nArguments\n\ncoeffs::AbstractVector{<:AbstractFloat}: Vector of Chebyshev coefficients\n\nReturns\n\nVector of values at Chebyshev points\n\nImplementation Details\n\nFor n coefficients, creates a padded array of length 2n-2\nApplies symmetry to create the correct even/odd extension\nPerforms FFT transformation\nExtracts and scales the real parts to obtain final values\nEnforces symmetry properties based on coefficient pattern:\nEven symmetry if even-indexed coefficients are zero\nOdd symmetry if odd-indexed coefficients are zero\n\n\n\n\n\n","category":"method"},{"location":"cheb/#PDESuite.ChebyshevSuite.Cheb2Vals2CoeffsOp","page":"Chebyshev Suite","title":"PDESuite.ChebyshevSuite.Cheb2Vals2CoeffsOp","text":"Cheb2Vals2CoeffsOp{TR<:AbstractFloat,TP<:Plan}\n\nAn operator type for converting values at Chebyshev points of the 2nd kind to Chebyshev coefficients.\n\nFields\n\ntmp::Vector{Complex{TR}}: Temporary storage for FFT computations\ncoeffs::Vector{TR}: Storage for the resulting coefficients\nifft_plan::TP: Pre-computed IFFT plan for efficient transforms\n\nExample\n\nn = 100\nvals = rand(n)\nop = Cheb2Vals2CoeffsOp(Float64, n)\ncoeffs = op(vals)\n\n\n\n\n\n","category":"type"},{"location":"cheb/#PDESuite.ChebyshevSuite.Cheb2Vals2CoeffsOp-Union{Tuple{AbstractVector{TR}}, Tuple{TP}, Tuple{TR}} where {TR<:AbstractFloat, TP<:AbstractFFTs.Plan}","page":"Chebyshev Suite","title":"PDESuite.ChebyshevSuite.Cheb2Vals2CoeffsOp","text":"(op::Cheb2Vals2CoeffsOp)(vals::AbstractVector)\n\nConvert values at Chebyshev points to coefficients using a pre-allocated operator.\n\nArguments\n\nvals: Vector of values at Chebyshev points of the 2nd kind\n\nReturns\n\nVector of Chebyshev coefficients\n\nDetails\n\nThe function performs these steps:\n\nChecks for trivial cases (n ≤ 1)\nDetects symmetries in the input data\nMirrors the values for FFT processing\nApplies IFFT and extracts real coefficients\nEnforces detected symmetries in the result\n\nThe transformation preserves both even and odd symmetries if present in the input data.\n\n\n\n\n\n","category":"method"},{"location":"cheb/#PDESuite.ChebyshevSuite.ChebCumsumOp","page":"Chebyshev Suite","title":"PDESuite.ChebyshevSuite.ChebCumsumOp","text":"ChebCumsumOp{TR<:AbstractFloat,TI<:Integer}\n\nA pre-allocated operator for computing the indefinite integral (cumulative sum) of a function represented in the Chebyshev basis.\n\nFields\n\nn::TI: Number of coefficients in the expansion\ntmp::Vector{TR}: Temporary storage for padded coefficients\nresult::Vector{TR}: Storage for the result coefficients\nv::Vector{TI}: Pre-computed alternating signs [1, -1, 1, -1, ...]\n\nType Parameters\n\nTR: The floating-point type for coefficients (e.g., Float64)\nTI: The integer type for indexing and signs (e.g., Int64)\n\n\n\n\n\n","category":"type"},{"location":"cheb/#PDESuite.ChebyshevSuite.ChebCumsumOp-Union{Tuple{VT}, Tuple{TI}, Tuple{TR}} where {TR<:AbstractFloat, TI<:Integer, VT<:AbstractVector{TR}}","page":"Chebyshev Suite","title":"PDESuite.ChebyshevSuite.ChebCumsumOp","text":"(op::ChebCumsumOp)(f::AbstractVector)\n\nCompute the indefinite integral of a function given its Chebyshev coefficients.\n\nArguments\n\nf: Vector of Chebyshev coefficients of the function to be integrated\n\nReturns\n\nVector of Chebyshev coefficients of the indefinite integral\n\nNotes\n\nThe integration constant is chosen such that f(-1) = 0. The computation follows the recurrence relation for Chebyshev integration:\n\nb₂ = c₁ - c₃/2\nbᵣ = (cᵣ₋₁ - cᵣ₊₁)/(2r) for r > 1\nb₀ is computed to ensure f(-1) = 0\n\nwhere bᵢ are the coefficients of the integral and cᵢ are the input coefficients.\n\n\n\n\n\n","category":"method"},{"location":"cheb/#PDESuite.ChebyshevSuite.bary-Union{Tuple{VT3}, Tuple{VT2}, Tuple{VT1}, Tuple{TR}, Tuple{VT1, VT2, VT3, TR}} where {TR<:AbstractFloat, VT1<:AbstractVector{TR}, VT2<:AbstractVector{TR}, VT3<:AbstractVector{TR}}","page":"Chebyshev Suite","title":"PDESuite.ChebyshevSuite.bary","text":"bary(w::VT1, x::VT2, f::VT3, x0::TR) where {\n    TR<:AbstractFloat,\n    VT1<:AbstractVector{TR},\n    VT2<:AbstractVector{TR},\n    VT3<:AbstractVector{TR},\n}\n\nEvaluate a polynomial interpolant using the barycentric interpolation formula.\n\nArguments\n\nw: Vector of barycentric weights\nx: Vector of interpolation points (typically Chebyshev points)\nf: Vector of function values at interpolation points\nx0: Point at which to evaluate the interpolant\n\nReturns\n\nInterpolated value at x0\n\nMathematical Details\n\nThe barycentric interpolation formula is:\n\np(x) = begincases\nf_j  textif  x = x_j text for some  j \nfracsum_j=0^n-1 fracw_jx-x_jf_jsum_j=0^n-1 fracw_jx-x_j  textotherwise\nendcases\n\nThis formula provides a numerically stable way to evaluate the Lagrange interpolation polynomial. When used with Chebyshev points and their corresponding barycentric weights, it gives optimal interpolation properties.\n\nExamples\n\n# Set up interpolation points and weights\nn = 10\nx = cheb2_pts(Float64, n)\nw = cheb2_barywts(Float64, n)\n\n# Function to interpolate\nf = sin.(π .* x)\n\n# Evaluate interpolant at a point\nx0 = 0.5\ny = bary(w, x, f, x0)\n\nReference\n\nSalzer [Sal72]\nTrefethen [Tre19]\nchebfun/@chebtech2/bary.m at master · chebfun/chebfun\n\nSee also: cheb1_barywts, cheb1_pts, cheb2_barywts, cheb2_pts\n\n\n\n\n\n","category":"method"},{"location":"cheb/#PDESuite.ChebyshevSuite.bary_diffmat-Union{Tuple{TI}, Tuple{VT3}, Tuple{VT2}, Tuple{VT1}, Tuple{TR}, Tuple{VT1, VT2, TI, VT3}} where {TR<:AbstractFloat, VT1<:AbstractVector{TR}, VT2<:AbstractVector{TR}, VT3<:AbstractVector{TR}, TI<:Integer}","page":"Chebyshev Suite","title":"PDESuite.ChebyshevSuite.bary_diffmat","text":"bary_diffmat(x; w=nothing, k=1, t=nothing)\n\nCompute the barycentric differentiation matrix for points in the vector x.\n\n• x is a vector of distinct interpolation points. • w is an vector of barycentric weights associated with x.  • k is the order of the derivative to be approximated (default is 1). • t is an vector (e.g., acos.(x)) that may improve numerical stability for   certain sets of points (see references [4]).\n\nReturns the matrix D such that D * f_values ≈ f' (or higher derivatives) at the points in x, based on the barycentric interpolation formula.\n\nReferences: [1] Schneider, C., & Werner, W. (1986). Some new aspects of rational interpolation. Mathematics of Computation, 47(176), 285–299. [2] Welfert, B. D. (1997). Generation of pseudospectral matrices I. SIAM Journal on Numerical Analysis, 34(4), 1640–1657. [3] Tee, T. W. (2006). An adaptive rational spectral method for differential equations with rapidly varying solutions (DPhil Thesis). University of Oxford. [4] Baltensperger, R., & Trummer, M. R. (2003). Spectral Differencing with a Twist. SIAM Journal on Scientific Computing, 24(5), 1465–1487. [5] chebfun/@chebcolloc/baryDiffMat.m at master · chebfun/chebfun\n\n\n\n\n\n","category":"method"},{"location":"cheb/#PDESuite.ChebyshevSuite.cheb1_amat-Union{Tuple{TI}, Tuple{TR}, Tuple{Type{TR}, TI}} where {TR<:AbstractFloat, TI<:Integer}","page":"Chebyshev Suite","title":"PDESuite.ChebyshevSuite.cheb1_amat","text":"cheb1_amat([TR=Float64], n::Integer)\n\nConstruct the analysis matrix A that transforms function values at Chebyshev points of the 1st kind to Chebyshev coefficients.\n\nArguments\n\nTR: Element type (defaults to Float64)\nn: Number of points/coefficients\n\n\n\n\n\n","category":"method"},{"location":"cheb/#PDESuite.ChebyshevSuite.cheb1_angles-Union{Tuple{TI}, Tuple{TR}, Tuple{Type{TR}, TI}} where {TR<:AbstractFloat, TI<:Integer}","page":"Chebyshev Suite","title":"PDESuite.ChebyshevSuite.cheb1_angles","text":"cheb1_angles([TR=Float64], n::TI) where {TR<:AbstractFloat,TI<:Integer}\n\nCompute angles for Chebyshev points of the 1st kind: theta_k = frac(2k + 1)pi2n quad k = n-1ldots0\n\nArguments\n\nTR: Type parameter for the angles (e.g., Float64)\nn: Number of points\n\n\n\n\n\n","category":"method"},{"location":"cheb/#PDESuite.ChebyshevSuite.cheb1_barywts-Union{Tuple{TI}, Tuple{TR}, Tuple{Type{TR}, TI}} where {TR<:AbstractFloat, TI<:Integer}","page":"Chebyshev Suite","title":"PDESuite.ChebyshevSuite.cheb1_barywts","text":"cheb1_barywts([TR=Float64], n::TI) where {TR<:AbstractFloat,TI<:Integer}\n\nCompute the barycentric weights for Chebyshev points of the 1st kind.\n\nArguments\n\nTR: Type parameter for the weights (e.g., Float64)\nn: Number of points\n\nReferences\n\nBerrut and Trefethen [BT04]\nchebfun/@chebtech1/barywts.m at master · chebfun/chebfun\n\nSee also: bary, cheb1_pts\n\n\n\n\n\n","category":"method"},{"location":"cheb/#PDESuite.ChebyshevSuite.cheb1_diffmat-Union{Tuple{TI}, Tuple{TR}, Tuple{Type{TR}, TI}, Tuple{Type{TR}, TI, TI}} where {TR<:AbstractFloat, TI<:Integer}","page":"Chebyshev Suite","title":"PDESuite.ChebyshevSuite.cheb1_diffmat","text":"cheb1_diffmat(n::TI, k::TI=1) where {TI<:Integer}\n\nConstruct a Chebyshev differentiation matrix for points of the 1st kind.\n\nDescription\n\nCreates a matrix that maps function values at n Chebyshev points of the 1st kind  to values of the k-th derivative of the interpolating polynomial at those points.\n\nArguments\n\nn::Integer: Number of Chebyshev points\nk::Integer=1: Order of the derivative (default: 1)\n\nReturns\n\nMatrix that computes the k-th derivative when multiplied with function values\n\nExamples\n\n# First derivative matrix for 5 points\nD1 = cheb1_diffmat(5)\n\n# Second derivative matrix for 5 points\nD2 = cheb1_diffmat(5, 2)\n\n# Apply to function values\nvals = [1.0, 2.0, 3.0, 4.0, 5.0]\nderiv_vals = D1 * vals\n\nReferences\n\nBased on the MATLAB Chebfun implementation\n\n\n\n\n\n","category":"method"},{"location":"cheb/#PDESuite.ChebyshevSuite.cheb1_pts-Union{Tuple{TI}, Tuple{TR}, Tuple{Type{TR}, TI}} where {TR<:AbstractFloat, TI<:Integer}","page":"Chebyshev Suite","title":"PDESuite.ChebyshevSuite.cheb1_pts","text":"cheb1_pts([TR=Float64], n::Integer)\ncheb1_pts([TR=Float64], n::Integer, x_min::TR, x_max::TR)\n\nGenerate Chebyshev points of the 1st kind.\n\nArguments\n\nTR: Type parameter for the grid points (e.g., Float64)\nn: Number of points\nx_min: (Optional) Lower bound of the mapped interval\nx_max: (Optional) Upper bound of the mapped interval\n\nReturns\n\nVector of n Chebyshev points of the 1st kind\n\nMathematical Details\n\nFor the standard interval [-1,1]: x_k = -cosleft(frac(2k + 1)pi2nright) quad k = 01ldotsn-1\n\nFor mapped interval [xmin,xmax]: x_mapped = fracx_max + x_min2 + fracx_min - x_max2x_k\n\nNotes\n\nChebyshev points of the 1st kind are the roots of Chebyshev polynomials T_n(x). The convenience methods with Integer arguments default to Float64 precision.\n\nExamples\n\n# Generate 5 points on [-1,1]\nx = cheb1_pts(Float64, 5)\nx = cheb1_pts(5)  # Same as above\n\n# Generate 5 points mapped to [0,1]\nx = cheb1_pts(Float64, 5, 0.0, 1.0)\nx = cheb1_pts(5, 0.0, 1.0)  # Same as above\n\nSee also: cheb1_angles, cheb2_pts\n\n\n\n\n\n","category":"method"},{"location":"cheb/#PDESuite.ChebyshevSuite.cheb1_quadwts-Union{Tuple{TI}, Tuple{TR}, Tuple{Type{TR}, TI}} where {TR<:AbstractFloat, TI<:Integer}","page":"Chebyshev Suite","title":"PDESuite.ChebyshevSuite.cheb1_quadwts","text":"cheb1_quadwts([TR=Float64], n::Integer)\n\nCompute quadrature weights for Chebyshev points of the 1st kind.\n\nArguments\n\nTR: Type parameter for the weights (e.g., Float64)\nn: Number of points\n\nReturns\n\nVector of n weights for Chebyshev quadrature\n\nMathematical Background\n\nFor a function expressed in the Chebyshev basis:\n\nf(x) = sum_k=0^n c_k T_k(x)\n\nThe definite integral can be expressed as:\n\nint_-1^1 f(x)dx = mathbfv^Tmathbfc\n\nwhere mathbfv contains the integrals of Chebyshev polynomials:\n\nv_k = int_-1^1 T_k(x)dx = begincases\nfrac21-k^2  k text even \n0  k text odd\nendcases\n\nThe quadrature weights mathbfw satisfy:\n\nint_-1^1 f(x)dx approx sum_j=1^n w_j f(x_j)\n\nAlgorithm\n\nUses Waldvogel's algorithm (2006) with modifications by Nick Hale:\n\nCompute exact integrals of even-indexed Chebyshev polynomials\nMirror the sequence for DCT via FFT\nApply inverse FFT\nAdjust boundary weights\n\nEdge Cases\n\nn = 0: Returns empty vector\nn = 1: Returns [2.0]\nn ≥ 2: Returns full set of weights\n\nExamples\n\n# Compute weights for 5-point quadrature\nw = cheb1_quadwts(5)\n\n# Integrate sin(x) from -1 to 1\nx = cheb1_pts(5)\nf = sin.(x)\nI = dot(w, f)  # ≈ 0\n\nReferences\n\nWaldvogel [Wal06]\nFast Clenshaw-Curtis Quadrature - File Exchange - MATLAB Central\n\n\n\n\n\n","category":"method"},{"location":"cheb/#PDESuite.ChebyshevSuite.cheb1_smat-Union{Tuple{TI}, Tuple{TR}, Tuple{Type{TR}, TI}} where {TR<:AbstractFloat, TI<:Integer}","page":"Chebyshev Suite","title":"PDESuite.ChebyshevSuite.cheb1_smat","text":"cheb1_smat([TR=Float64], n::Integer)\n\nConstruct the synthesis matrix S that transforms Chebyshev coefficients to function values at Chebyshev points of the 1st kind.\n\nArguments\n\nTR: Element type (defaults to Float64)\nn: Number of points/coefficients\n\n\n\n\n\n","category":"method"},{"location":"cheb/#PDESuite.ChebyshevSuite.cheb2_amat-Union{Tuple{TI}, Tuple{TR}, Tuple{Type{TR}, TI}} where {TR<:AbstractFloat, TI<:Integer}","page":"Chebyshev Suite","title":"PDESuite.ChebyshevSuite.cheb2_amat","text":"cheb2_amat([TR=Float64], n::TI) where {TR<:AbstractFloat,TI<:Integer}\n\nConstruct the analysis matrix A that transforms function values at Chebyshev points of the 2nd kind to Chebyshev coefficients.\n\nArguments\n\nTR: Element type (defaults to Float64)\nn: Number of points/coefficients\n\n\n\n\n\n","category":"method"},{"location":"cheb/#PDESuite.ChebyshevSuite.cheb2_angles-Union{Tuple{TI}, Tuple{TR}, Tuple{Type{TR}, TI}} where {TR<:AbstractFloat, TI<:Integer}","page":"Chebyshev Suite","title":"PDESuite.ChebyshevSuite.cheb2_angles","text":"cheb2_angles([TR=Float64], n::TI) where {TR<:AbstractFloat,TI<:Integer}\n\nCompute angles for Chebyshev points of the 2nd kind: theta_k = frackpin-1 quad k = n-1ldots0\n\nArguments\n\nTR: Type parameter for the angles (e.g., Float64)\nn: Number of points\n\n\n\n\n\n","category":"method"},{"location":"cheb/#PDESuite.ChebyshevSuite.cheb2_barywts-Union{Tuple{TI}, Tuple{TR}, Tuple{Type{TR}, TI}} where {TR<:AbstractFloat, TI<:Integer}","page":"Chebyshev Suite","title":"PDESuite.ChebyshevSuite.cheb2_barywts","text":"cheb2_barywts([TR=Float64], n::TI) where {TR<:AbstractFloat,TI<:Integer}\n\nCompute the barycentric weights for Chebyshev points of the 2nd kind.\n\nArguments\n\nTR: Type parameter for the weights (e.g., Float64)\nn: Number of points\n\nReferences\n\nchebfun/@chebtech2/barywts.m at master · chebfun/chebfun\n\nSee also: bary, cheb2_pts\n\n\n\n\n\n","category":"method"},{"location":"cheb/#PDESuite.ChebyshevSuite.cheb2_coeffs2vals-Union{Tuple{VT}, Tuple{TR}} where {TR<:AbstractFloat, VT<:AbstractVector{TR}}","page":"Chebyshev Suite","title":"PDESuite.ChebyshevSuite.cheb2_coeffs2vals","text":"cheb2_coeffs2vals(coeffs::VT) where {TR<:AbstractFloat,VT<:AbstractVector{TR}}\n\nConvert Chebyshev coefficients of the 2nd kind to values at Chebyshev points.\n\nArguments\n\ncoeffs::AbstractVector{<:AbstractFloat}: Vector of Chebyshev coefficients\n\nReturns\n\nVector of values at Chebyshev points of the 2nd kind\n\nDescription\n\nThis function transforms Chebyshev coefficients to values at Chebyshev points using an FFT-based algorithm. For a polynomial of degree n-1, the transformation maps n coefficients to n values at the Chebyshev points of the 2nd kind: cos(jπ/(n-1)) for j = 0:n-1.\n\nExample\n\ncoeffs = [1.0, 2.0, 3.0]  # Chebyshev coefficients\nvals = cheb2_coeffs2vals(coeffs)  # Values at Chebyshev points\n\n\n\n\n\n","category":"method"},{"location":"cheb/#PDESuite.ChebyshevSuite.cheb2_pts-Union{Tuple{TI}, Tuple{TR}, Tuple{Type{TR}, TI}} where {TR<:AbstractFloat, TI<:Integer}","page":"Chebyshev Suite","title":"PDESuite.ChebyshevSuite.cheb2_pts","text":"cheb2_pts([TR=Float64], n::Integer)\ncheb2_pts([TR=Float64], n::Integer, x_min::TR, x_max::TR)\n\nGenerate Chebyshev points of the 2nd kind.\n\nArguments\n\nTR: Type parameter for the grid points (e.g., Float64)\nn: Number of points\nx_min: (Optional) Lower bound of the mapped interval\nx_max: (Optional) Upper bound of the mapped interval\n\nReturns\n\nVector of n Chebyshev points of the 2nd kind\n\nMathematical Details\n\nFor the standard interval [-1,1]: x_k = -cosleft(frackpin-1right) quad k = 01ldotsn-1\n\nFor mapped interval [xmin,xmax]: x_mapped = fracx_max + x_min2 + fracx_min - x_max2x_k\n\nNotes\n\nChebyshev points of the 2nd kind are the extrema of Chebyshev polynomials T_n(x). These points include the endpoints, making them suitable for boundary value problems. The convenience methods with Integer arguments default to Float64 precision.\n\nExamples\n\n# Generate 5 points on [-1,1]\nx = cheb2_pts(Float64, 5)\nx = cheb2_pts(5)  # Same as above\n\n# Generate 5 points mapped to [0,π]\nx = cheb2_pts(Float64, 5, 0.0, π)\nx = cheb2_pts(5, 0.0, π)  # Same as above\n\nSee also: cheb2_angles, cheb1_pts\n\n\n\n\n\n","category":"method"},{"location":"cheb/#PDESuite.ChebyshevSuite.cheb2_quadwts-Union{Tuple{TI}, Tuple{TR}, Tuple{Type{TR}, TI}} where {TR<:AbstractFloat, TI<:Integer}","page":"Chebyshev Suite","title":"PDESuite.ChebyshevSuite.cheb2_quadwts","text":"cheb2_quadwts([TR=Float64], n::Integer)\n\nCompute quadrature weights for Chebyshev points of the 2nd kind (Clenshaw-Curtis quadrature).\n\nArguments\n\nTR: Type parameter for the weights (e.g., Float64)\nn: Number of points\n\nReturns\n\nVector of n weights for Clenshaw-Curtis quadrature\n\nMathematical Background\n\nFor a function expressed in the Chebyshev basis:\n\nf(x) = sum_k=0^n c_k T_k(x)\n\nThe definite integral can be expressed as:\n\nint_-1^1 f(x)dx = mathbfv^Tmathbfc\n\nwhere mathbfv contains the integrals of Chebyshev polynomials:\n\nv_k = int_-1^1 T_k(x)dx = begincases\nfrac21-k^2  k text even \n0  k text odd\nendcases\n\nThe quadrature weights mathbfw satisfy:\n\nint_-1^1 f(x)dx approx sum_j=1^n w_j f(x_j)\n\nAlgorithm\n\nUses Waldvogel's algorithm (2006) with modifications by Nick Hale:\n\nCompute exact integrals of even-indexed Chebyshev polynomials\nMirror the sequence for DCT via FFT\nApply inverse FFT\nAdjust boundary weights\n\nEdge Cases\n\nn = 0: Returns empty vector\nn = 1: Returns [2.0]\nn ≥ 2: Returns full set of weights\n\nExamples\n\n# Compute weights for 5-point quadrature\nw = cheb2_quadwts(5)\n\n# Integrate sin(x) from -1 to 1\nx = cheb2_pts(5)\nf = sin.(x)\nI = dot(w, f)  # ≈ 0\n\nReferences\n\nWaldvogel [Wal06]\nFast Clenshaw-Curtis Quadrature - File Exchange - MATLAB Central\n\n\n\n\n\n","category":"method"},{"location":"cheb/#PDESuite.ChebyshevSuite.cheb2_smat-Union{Tuple{TI}, Tuple{TR}, Tuple{Type{TR}, TI}} where {TR<:AbstractFloat, TI<:Integer}","page":"Chebyshev Suite","title":"PDESuite.ChebyshevSuite.cheb2_smat","text":"cheb1_smat([TR=Float64], n::TI) where {TR<:AbstractFloat,TI<:Integer}\n\nConstruct the synthesis matrix S that transforms Chebyshev coefficients to function values at Chebyshev points of the 2nd kind.\n\nArguments\n\nTR: Element type (defaults to Float64)\nn: Number of points/coefficients\n\n\n\n\n\n","category":"method"},{"location":"cheb/#PDESuite.ChebyshevSuite.cheb2_vals2coeffs-Union{Tuple{VT}, Tuple{TR}} where {TR<:AbstractFloat, VT<:AbstractVector{TR}}","page":"Chebyshev Suite","title":"PDESuite.ChebyshevSuite.cheb2_vals2coeffs","text":"cheb2_vals2coeffs(vals::AbstractVector)\n\nConvert values at Chebyshev points of the 2nd kind to Chebyshev coefficients.\n\nArguments\n\nvals: Vector of values at Chebyshev points\n\nReturns\n\nVector of Chebyshev coefficients\n\nExample\n\nvals = [1.0, 2.0, 3.0, 4.0, 5.0]\ncoeffs = cheb2_vals2coeffs(vals)\n\nThis is a convenience wrapper around Cheb2Vals2CoeffsOp for one-off conversions. For repeated conversions with the same size, create and reuse a Cheb2Vals2CoeffsOp.\n\n\n\n\n\n","category":"method"},{"location":"cheb/#PDESuite.ChebyshevSuite.cheb_clenshaw-Union{Tuple{VT}, Tuple{T}, Tuple{VT, T}} where {T<:AbstractFloat, VT<:AbstractVector{T}}","page":"Chebyshev Suite","title":"PDESuite.ChebyshevSuite.cheb_clenshaw","text":"cheb_clenshaw(c::VT, x::T) where {T<:AbstractFloat,VT<:AbstractVector{T}}\n\nEvaluate a Chebyshev series using the Clenshaw algorithm.\n\nMathematical Background\n\nFor a Chebyshev series:\n\nf(x) = sum_k=0^n c_k T_k(x)\n\nwhere T_k(x) are Chebyshev polynomials of the 1st kind, the Clenshaw algorithm computes the sum using the recurrence relation:\n\nbeginalign*\nb_n+1 = b_n+2 = 0 \nb_k = c_k + 2x b_k+1 - b_k+2 \nf(x) = fracb_0 - b_22\nendalign*\n\nArguments\n\nc: Vector of Chebyshev coefficients c_0 c_1 ldots c_n\nx: Evaluation point in [-1,1]\n\nReturns\n\nValue of the Chebyshev series at x\n\nPerformance Notes\n\nUses @inbounds for efficiency in the main loop\nAvoids allocations in the recurrence calculation\nPre-scales x to reduce operations in the loop\n\nExamples\n\n# Evaluate T₀(x) = 1\njulia> cheb_clenshaw([1.0], 0.5)\n1.0\n\n# Evaluate T₁(x) = x\njulia> cheb_clenshaw([0.0, 1.0], 0.5)\n0.5\n\n# Evaluate 1 + 2x + 3x²\njulia> c = [1.0, 2.0, 3.0]\njulia> x = 0.5\njulia> cheb_clenshaw(c, x)\n2.75\n\n\n\n\n\n","category":"method"},{"location":"cheb/#PDESuite.ChebyshevSuite.cheb_coeffs_cumsummat-Union{Tuple{TI}, Tuple{TR}, Tuple{Type{TR}, TI}} where {TR<:AbstractFloat, TI<:Integer}","page":"Chebyshev Suite","title":"PDESuite.ChebyshevSuite.cheb_coeffs_cumsummat","text":"cheb_coeffs_cumsummat([TR=Float64], n::Integer)\ncheb_coeffs_cumsummat([TR=Float64], n::Integer, x_min::TR, x_max::TR)\n\nGenerate the Chebyshev coefficient integration matrix for spectral integration.\n\nArguments\n\nTR: Type parameter for the matrix elements (e.g., Float64)\nn: Size of the matrix (n×n)\nx_min: (Optional) Lower bound of the integration interval\nx_max: (Optional) Upper bound of the integration interval\n\nReturns\n\nMatrix{TR}: The integration matrix B (n×n)\n\nMathematical Background\n\nThe integration matrix B operates on Chebyshev spectral coefficients to compute the coefficients of the indefinite integral. For a function expressed in the  Chebyshev basis:\n\nf(x) = sum_k=0^N-1 a_k T_k(x)\n\nThe indefinite integral's coefficients b_k in:\n\nint f(x)dx = sum_k=0^N-1 b_k T_k(x) + C\n\nare computed using the matrix B: b = Ba\n\nThe matrix elements are derived from the integration relation of Chebyshev polynomials:\n\nint T_n(x)dx = frac12left(fracT_n+1(x)n+1 - fracT_n-1(x)n-1right)\n\nWhen x_min and x_max are provided, the matrix is scaled for integration over [xmin, xmax].\n\n\n\n\n\n","category":"method"},{"location":"cheb/#PDESuite.ChebyshevSuite.cheb_cumsum-Union{Tuple{VT}, Tuple{TR}} where {TR<:AbstractFloat, VT<:AbstractVector{TR}}","page":"Chebyshev Suite","title":"PDESuite.ChebyshevSuite.cheb_cumsum","text":"cheb_cumsum(f::AbstractVector)\n\nCompute the indefinite integral of a function given its Chebyshev coefficients. This is a convenience wrapper that creates a temporary ChebCumsumOp.\n\nArguments\n\nf: Vector of Chebyshev coefficients of the function to be integrated\n\nReturns\n\nVector of Chebyshev coefficients of the indefinite integral\n\nExample\n\n# Integrate cos(x)\nn = 15\nf = cos.(cheb1_pts(n))\nf_coeffs = cheb1_vals2coeffs(f)\nIf_coeffs = cheb_cumsum(f_coeffs)  # Coefficients of sin(x) - sin(-1)\n\n\n\n\n\n","category":"method"},{"location":"cheb/#PDESuite.ChebyshevSuite.cheb_feval-Union{Tuple{VT}, Tuple{TR}, Tuple{VT, TR}} where {TR<:AbstractFloat, VT<:AbstractVector{TR}}","page":"Chebyshev Suite","title":"PDESuite.ChebyshevSuite.cheb_feval","text":"cheb_feval(f::VT, x::TR) where {TR<:AbstractFloat,VT<:AbstractVector{TR}}\n\nEvaluate a Chebyshev series at specified points.\n\nMathematical Background\n\nFor a Chebyshev series:\n\nf(x) = sum_k=0^n c_k T_k(x)\n\nwhere T_k(x) are Chebyshev polynomials of the 1st kind, this module provides two evaluation methods:\n\nClenshaw algorithm (default) - Efficient for moderate degree polynomials\nNDCT (TODO) - Fast for high degree polynomials with many evaluation points\n\nCurrent Implementation\n\nCurrently uses Clenshaw's algorithm exclusively. Future versions will implement NDCT for improved performance on high-degree polynomials (n > 4000) or many evaluation points.\n\nPerformance Notes\n\nClenshaw's algorithm: O(n) operations per point\nNDCT (planned): O(n log n) operations for many points simultaneously\n\nExamples\n\n# Evaluate using coefficients directly\ncoeffs = [1.0, 2.0, 3.0]  # f(x) = 1 + 2T₁(x) + 3T₂(x)\nx = 0.5\ny = cheb_clenshaw(coeffs, x)\n\nReferences\n\nTrefethen [Tre19]\nMason and Handscomb [MH02]\nchebfun/@chebtech/feval.m at master · chebfun/chebfun\n\n\n\n\n\n","category":"method"},{"location":"cheb/#PDESuite.ChebyshevSuite.cheb_rectdiff1-Union{Tuple{TI}, Tuple{TR}, Tuple{Type{TR}, TI, TI}} where {TR<:AbstractFloat, TI<:Integer}","page":"Chebyshev Suite","title":"PDESuite.ChebyshevSuite.cheb_rectdiff1","text":"cheb_rectdiff1(m, n)\n\nConstructing a 1st-order rectangular differentiation matrix mapping from a 1st-kind grid\n\nArguments:\n\nm : Size of the output grid (number of rows).\nn : Size of the input grid (number of columns).\n\nReturns:\n\nD : The rectangular differentiation matrix (size m x n).\n\n\n\n\n\n","category":"method"},{"location":"cheb/#PDESuite.ChebyshevSuite.cheb_rectdiff2-Union{Tuple{TI}, Tuple{TR}, Tuple{Type{TR}, TI, TI}} where {TR<:AbstractFloat, TI<:Integer}","page":"Chebyshev Suite","title":"PDESuite.ChebyshevSuite.cheb_rectdiff2","text":"cheb_rectdiff2(m, n)\n\nConstruct a 1st-order rectangular differentiation matrix mapping from a 2nd-kind grid.\n\nArguments:\n\nm : Size of the output grid (number of rows)\nn : Size of the input grid (number of columns)\n\nReturns:\n\nD : The rectangular differentiation matrix (size m x n)\n\n\n\n\n\n","category":"method"},{"location":"cheb/#PDESuite.ChebyshevSuite.cheb_rectint-Union{Tuple{TI}, Tuple{TR}, Tuple{Type{TR}, TI, TI}} where {TR<:AbstractFloat, TI<:Integer}","page":"Chebyshev Suite","title":"PDESuite.ChebyshevSuite.cheb_rectint","text":"cheb_rectint([TR=Float64], n::Integer)\ncheb_rectint([TR=Float64], n::Integer, x_min::TR, x_max::TR)\n\nGenerate the Chebyshev integration matrix that operates directly on function values.\n\nArguments\n\nTR: Type parameter for the matrix elements (e.g., Float64)\nn: Size of the matrix (n×n)\nx_min: (Optional) Lower bound of the integration interval\nx_max: (Optional) Upper bound of the integration interval\n\nReturns\n\nMatrix{TR}: The integration matrix that operates on function values\n\nExamples\n\n# Generate 8×8 integration matrix for [-1,1]\nI = cheb_rectint(Float64, 8)\n\n# Get function values at Chebyshev points\nx = cheb2_pts(Float64, 8)\nf = sin.(x)\n\n# Compute indefinite integral (-cos(x) + C)\nF = I * f\n\n# Integration matrix for [0,π]\nI_scaled = cheb_rectint(Float64, 8, 0.0, π)\n\n\n\n\n\n","category":"method"},{"location":"cheb/#PDESuite.ChebyshevSuite.runtests-Tuple","page":"Chebyshev Suite","title":"PDESuite.ChebyshevSuite.runtests","text":"PDESuite.ChebyshevSuite.runtests(pattern...; kwargs...)\n\nEquivalent to ReTest.retest(PDESuite.ChebyshevSuite, pattern...; kwargs...). This function is defined automatically in any module containing a @testset, possibly nested within submodules.\n\n\n\n\n\n","category":"method"},{"location":"cheb/","page":"Chebyshev Suite","title":"Chebyshev Suite","text":"M. C. Babiuc and others. Implementation of standard testbeds for numerical relativity. Class. Quant. Grav. 25, 125012 (2008), arXiv:0709.3559 [gr-qc].\n\n\n\nJ.-P. Berrut and L. N. Trefethen. Barycentric lagrange interpolation. SIAM review 46, 501–517 (2004).\n\n\n\nB. Fornberg. Generation of finite difference formulas on arbitrarily spaced grids. Mathematics of computation 51, 699–706 (1988).\n\n\n\nB. Fornberg. Classroom Note:Calculation of Weights in Finite Difference Formulas. SIAM Review 40, 685–691 (1998), arXiv:https://doi.org/10.1137/S0036144596322507.\n\n\n\nB. Fornberg. An algorithm for calculating Hermite-based finite difference weights. IMA Journal of Numerical Analysis 41, 801–813 (2021).\n\n\n\nJ. C. Mason and D. C. Handscomb. Chebyshev polynomials (Chapman and Hall/CRC, 2002).\n\n\n\nH. E. Salzer. Lagrangian interpolation at the Chebyshev points xn, nuequiv cos (nupi/n), nu= 0 (1) n; some unnoted advantages. The Computer Journal 15, 156–159 (1972).\n\n\n\nL. N. Trefethen. Approximation Theory and Approximation Practice, Extended Edition (Society for Industrial and Applied Mathematics, Philadelphia, PA, 2019), arXiv:https://epubs.siam.org/doi/pdf/10.1137/1.9781611975949.\n\n\n\nJ. Waldvogel. Fast construction of the Fejér and Clenshaw–Curtis quadrature rules. BIT Numerical Mathematics 46, 195–202 (2006).\n\n\n\n","category":"page"},{"location":"fdm/#Finite-Difference-Suite","page":"Finite Difference Suite","title":"Finite Difference Suite","text":"","category":"section"},{"location":"fdm/","page":"Finite Difference Suite","title":"Finite Difference Suite","text":"Modules = [PDESuite.FiniteDifferenceSuite]","category":"page"},{"location":"fdm/","page":"Finite Difference Suite","title":"Finite Difference Suite","text":"Modules = [PDESuite.FiniteDifferenceSuite]","category":"page"},{"location":"fdm/#PDESuite.FiniteDifferenceSuite.dissipation_order-Tuple{TI} where TI<:Integer","page":"Finite Difference Suite","title":"PDESuite.FiniteDifferenceSuite.dissipation_order","text":"dissipation_order(acc_order::Integer)\n\nCalculate the order of dissipation needed for a given finite difference accuracy order [B+08]. For a scheme of accuracy order 2r-2, returns dissipation order 2r.\n\n\n\n\n\n","category":"method"},{"location":"fdm/#PDESuite.FiniteDifferenceSuite.dissipation_wts-Tuple{TI} where TI<:Integer","page":"Finite Difference Suite","title":"PDESuite.FiniteDifferenceSuite.dissipation_wts","text":"calculate_dissipation_weights(diss_order::Integer)\n\nCalculate the weights for Kreiss-Oliger dissipation of given order [B+08].\n\n\n\n\n\n","category":"method"},{"location":"fdm/#PDESuite.FiniteDifferenceSuite.fdm_grid-Union{Tuple{TR}, Tuple{Type{TR}, TR, TR, TR}} where TR<:AbstractFloat","page":"Finite Difference Suite","title":"PDESuite.FiniteDifferenceSuite.fdm_grid","text":"fdm_grid(::Type{TR}, x_min::TR, x_max::TR, dx::TR) where {TR<:AbstractFloat}\n\nGenerate a uniform grid for finite difference methods.\n\nArguments\n\nTR: Type parameter for the grid points (e.g., Float64)\nx_min: Lower bound of the interval\nx_max: Upper bound of the interval\ndx: Grid spacing\n\nReturns\n\nVector of n uniformly spaced points, where n = round((xmax - xmin)/dx) + 1\n\nMathematical Details\n\nThe grid points are generated as:\n\nx_i = x_min + (i-1)dx quad i = 1ldotsn\n\nwhere n is chosen to ensure the grid covers [xmin, xmax] with spacing dx.\n\nNotes\n\nThe function ensures that x_max is accurately represented within floating-point precision\nThe actual number of points is computed to maintain uniform spacing\nThe final point may differ from x_max by at most machine epsilon\n\nExamples\n\n# Generate grid with spacing 0.1 on [0,1]\nx = fdm_grid(Float64, 0.0, 1.0, 0.1)\n\n# Generate grid with 100 points on [-1,1]\ndx = 2.0/99  # To get exactly 100 points\nx = fdm_grid(Float64, -1.0, 1.0, dx)\n\n\n\n\n\n","category":"method"},{"location":"fdm/#PDESuite.FiniteDifferenceSuite.fornberg_calculate_wts-Union{Tuple{TI}, Tuple{VT}, Tuple{T2}, Tuple{T}, Tuple{TI, T, VT}} where {T<:Real, T2<:Real, VT<:AbstractVector{T2}, TI<:Integer}","page":"Finite Difference Suite","title":"PDESuite.FiniteDifferenceSuite.fornberg_calculate_wts","text":"fornberg_calculate_wts([T=Float64], order::Integer, x0::Real, x::AbstractVector; \n                         dfdx::Bool=false)\n\nCalculate finite difference weights for arbitrary-order derivatives using the Fornberg algorithm.\n\nArguments\n\nT: Type parameter for the weights (defaults to type of x0)\norder: Order of the derivative to approximate\nx0: Point at which to approximate the derivative\nx: Grid points to use in the approximation\ndfdx: Whether to include first derivative values (Hermite finite differences)\n\nReturns\n\nIf dfdx == false:\n\nVector{T}: Weights for function values\n\nIf dfdx == true:\n\nTuple{Vector{T}, Vector{T}}: Weights for (function values, derivative values)\n\nMathematical Background\n\nFor a function f(x), the derivative approximation takes the form:\n\nIf dfdx == false (standard finite differences):\n\nf^(n)(x_0) approx sum_j=1^N c_j f(x_j)\n\nIf dfdx == true (Hermite finite differences):\n\nf^(n)(x_0) approx sum_j=1^N d_j f(x_j) + e_j f(x_j)\n\nRequirements\n\nFor standard finite differences: N > order\nFor Hermite finite differences: N > order/2 + 1\n\nwhere N is the length of x\n\nExamples\n\n# Standard central difference for first derivative\nx = [-1.0, 0.0, 1.0]\nw = fornberg_calculate_wts(1, 0.0, x)\n# Returns approximately [-0.5, 0.0, 0.5]\n\n# Forward difference for second derivative\nx = [0.0, 1.0, 2.0, 3.0]\nw = fornberg_calculate_wts(2, 0.0, x)\n\n# Hermite finite difference for third derivative\nx = [-1.0, 0.0, 1.0]\nw_f, w_d = fornberg_calculate_wts(3, 0.0, x, dfdx=true)\n\nReferences\n\nFornberg [For88]\nFornberg [For21]\nFornberg [For98]\nMethodOfLines.jl/src/discretization/schemes/fornbergcalculatewts.jl at master · SciML/MethodOfLines.jl\nprecision - Numerical derivative and finite difference coefficients: any update of the Fornberg method? - Computational Science Stack Exchange\n\nNotes\n\nThe implementation includes a stability correction for higher-order derivatives\nFor first derivatives (order=1), the weights sum to zero\nThe algorithm handles both uniform and non-uniform grids\nWhen using Hermite finite differences, fewer points are needed but derivatives must be available\n\nSee also: fdm_grid\n\n\n\n\n\n","category":"method"},{"location":"fdm/#PDESuite.FiniteDifferenceSuite.runtests-Tuple","page":"Finite Difference Suite","title":"PDESuite.FiniteDifferenceSuite.runtests","text":"PDESuite.FiniteDifferenceSuite.runtests(pattern...; kwargs...)\n\nEquivalent to ReTest.retest(PDESuite.FiniteDifferenceSuite, pattern...; kwargs...). This function is defined automatically in any module containing a @testset, possibly nested within submodules.\n\n\n\n\n\n","category":"method"},{"location":"fdm/","page":"Finite Difference Suite","title":"Finite Difference Suite","text":"","category":"page"},{"location":"","page":"Home","title":"Home","text":"CurrentModule = PDESuite","category":"page"},{"location":"#PDESuite","page":"Home","title":"PDESuite","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Documentation for PDESuite.","category":"page"},{"location":"","page":"Home","title":"Home","text":"warning: AI-Generated Documentation\nMost of the documentation in this package was generated with the assistance of AI. If you find any issues or areas that need clarification, please open an issue on GitHub.","category":"page"},{"location":"","page":"Home","title":"Home","text":"","category":"page"},{"location":"","page":"Home","title":"Home","text":"Modules = [PDESuite]","category":"page"},{"location":"#PDESuite.runtests-Tuple","page":"Home","title":"PDESuite.runtests","text":"PDESuite.runtests(pattern...; kwargs...)\n\nEquivalent to ReTest.retest(PDESuite, pattern...; kwargs...). This function is defined automatically in any module containing a @testset, possibly nested within submodules.\n\n\n\n\n\n","category":"method"}]
}
