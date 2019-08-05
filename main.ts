enum GyroAxis {
    //% block="x axis"
    x = 67,
    //% block="y axis"
    y = 69,
    //% block="z axis"
    z = 71
}
enum AccelAxis {
    //% block="x axis"
    x = 59,
    //% block="y axis"
    y = 61,
    //% block="z axis"
    z = 63
}



//% color="#AA11FF"
namespace IMU9250 {
    /**
     * reads data from a MPU-9250 IMU
     */
    export function read(axis: number): number {
        pins.i2cWriteNumber(104, axis, NumberFormat.Int8BE, true)
        let data = pins.i2cReadBuffer(104, 2, false)
        return (data.getNumber(NumberFormat.Int16BE, 0))
    }
    //% block
    export function Gyro(axis: GyroAxis): number {
        let reading = IMU9250.read(axis)
        return (reading)
    }
    //% block
    export function Accelerometer(axis: AccelAxis): number {
        let reading = IMU9250.read(axis)
        return (reading)
    }
}