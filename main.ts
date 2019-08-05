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
        pins.i2cWriteNumber(104, axis, NumberFormat.Int8BE, true)
        let data = pins.i2cReadBuffer(104, 2, false)
        return (data.getNumber(NumberFormat.Int16BE,0))
    }
}