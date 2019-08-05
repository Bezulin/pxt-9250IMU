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
    let xcal = 0
    let ycal = 0
    let zcal = 0
    /**
     * reads data from a MPU-9250 IMU
     */
    export function read(register: number): number {
        pins.i2cWriteNumber(104, register, NumberFormat.Int8BE, true)
        let data = pins.i2cReadBuffer(104, 2, false)
        return (data.getNumber(NumberFormat.Int16BE, 0))
    }

    //% block
    export function Gyro(axis: GyroAxis): number {
        let reading = IMU9250.read(axis)
        if (axis == 67) {
            return (reading - xcal)
        }
        if (axis == 69) {
            return (reading - ycal)
        }
        if (axis == 71) {
            return (reading - zcal)
        }
        else {
            return (0)
        }

    }

    //% block
    export function CallibrateGyro(): void {
        let x = 0
        let y = 0
        let z = 0
        for (let i = 0; i < 100; i++) {
            x += IMU9250.read(67)
            y += IMU9250.read(69)
            z += IMU9250.read(71)
        }
        xcal = x / 100
        ycal = y / 100
        zcal = z / 100
    }

    //% block
    export function Accelerometer(axis: AccelAxis): number {
        let reading = IMU9250.read(axis)
        return (reading)
    }

    //% block
    export function Temperature(): number {
        let reading = IMU9250.read(65)
        return (reading)
    }
}