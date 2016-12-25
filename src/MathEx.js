//
// Copyright (c) 2016 Satoshi Nakajima (https://github.com/snakajima)
// License: The MIT License
//

class MathEx {
    static round(value, precision=10) {
        return Math.floor(value * precision + 0.5) / precision;
    }
}

export default MathEx;
