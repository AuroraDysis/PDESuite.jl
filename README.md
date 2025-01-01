# PDESuite

[![Stable](https://img.shields.io/badge/docs-stable-blue.svg)](https://AuroraDysis.github.io/PDESuite.jl/stable/)
[![Dev](https://img.shields.io/badge/docs-dev-blue.svg)](https://AuroraDysis.github.io/PDESuite.jl/dev/)
[![Build Status](https://github.com/AuroraDysis/PDESuite.jl/actions/workflows/CI.yml/badge.svg?branch=main)](https://github.com/AuroraDysis/PDESuite.jl/actions/workflows/CI.yml?query=branch%3Amain)
[![Coverage](https://codecov.io/gh/AuroraDysis/PDESuite.jl/branch/main/graph/badge.svg)](https://codecov.io/gh/AuroraDysis/PDESuite.jl)
[![Code Style: Blue](https://img.shields.io/badge/code%20style-blue-4495d1.svg)](https://github.com/invenia/BlueStyle)
[![Aqua](https://raw.githubusercontent.com/JuliaTesting/Aqua.jl/master/badge.svg)](https://github.com/JuliaTesting/Aqua.jl)

## Description

This package offers high-performance, arbitrary-precision solutions for solving partial differential equations (PDEs) in general relativity. It features the following numerical methods:

- Chebyshev collocation in Chebyshev points of the first and second kinds  
- Rectangular collocation in Chebyshev points of the second kind (TODO)  
- Ultraspherical method (TODO)  
- Ultraspherical rectangular pseudospectral method (TODO)  

While the ChebyshevSuite is based on algorithms found in [Chebfun](https://github.com/chebfun/chebfun), it has been significantly enhanced in this package to prioritize performance and support arbitrary-precision calculations.