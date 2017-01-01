//
// Copyright (c) 2016 Satoshi Nakajima (https://github.com/snakajima)
// License: The MIT License
//

class MathEx {
    static round(value, precision=10) {
        return Math.floor(value * precision + 0.5) / precision;
    }
    
    static hasValue(e) {
      return (typeof e !== 'undefined');
    }
    
    static valueOf(e, defaultValue=0) {
        if (typeof e === 'undefined') {
            return defaultValue;
        }
        return e;
    }
}

export default MathEx;
