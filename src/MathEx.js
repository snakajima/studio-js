
class MathEx {
    static round(value, precision=10) {
        return Math.floor(value * precision) / precision;
    }
}

export default MathEx;
