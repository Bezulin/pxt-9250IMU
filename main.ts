enum Axis {
    //% block="x axis"
    x = 67,
    //% block="y axis"
    y = 69,
    //% block="z axis"
    z = 71
}



//% color="#AA11FF"
namespace IMU {
    /**
     * reads data from a MPU-9250 IMU
     */
    //% block
    export function readGyro(axis: Axis): number {
        let datah = 0
        let datal = 0
        pins.i2cWriteNumber(104, axis, NumberFormat.Int8BE, true)
        datah = pins.i2cReadNumber(104, NumberFormat.Int8BE, false)
        pins.i2cWriteNumber(104, axis + 1, NumberFormat.Int8BE, true)
        datal = pins.i2cReadNumber(104, NumberFormat.Int8BE, false)
        return (16 * datah + datal)
    }
}