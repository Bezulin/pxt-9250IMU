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
enum MagAxis {
    //% block="x axis"
    x = 3,
    //% block="y axis"
    y = 5,
    //% block="z axis"
    z = 7
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
        pins.i2cWriteNumber(104, register, NumberFormat.UInt8BE, true)
        let data = pins.i2cReadBuffer(104, 2, false)
        return (data.getNumber(NumberFormat.Int16BE, 0))
    }

    //% block
    export function Gyro(axis: GyroAxis): number {
        let reading = IMU9250.read(axis)
        if (axis == 67) {
            return ((reading - xcal) / 131)
        }
        if (axis == 69) {
            return ((reading - ycal) / 131)
        }
        if (axis == 71) {
            return ((reading - zcal) / 131)
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
        return (reading * .061)
    }

    //% block
    export function Temperature(): number {
        let reading = IMU9250.read(65)
        return ((reading - 1024) / 321 + 21)
    }
    //% block
    export function EnableMagnetometer(): void {
        pins.i2cWriteNumber(104, 55, NumberFormat.UInt8BE, true)
        let state = pins.i2cReadNumber(104, NumberFormat.UInt8BE, false)
        let stateswitch = state | 2
        let newstate = pins.createBuffer(16)
        newstate.setNumber(NumberFormat.UInt16BE, 0, (880 + stateswitch))
        pins.i2cWriteBuffer(104, newstate, false)
    }
    //% block
    export function readMagnetometer(axis: MagAxis): number {
        let magon = pins.createBuffer(16)
        magon.setNumber(NumberFormat.UInt16BE, 0, 177)
        pins.i2cWriteBuffer(12, magon, false)
        basic.pause(1)
        pins.i2cWriteNumber(12, axis, NumberFormat.UInt8BE, true)
        let data = pins.i2cReadBuffer(12, 2, false)
        return (data.getNumber(NumberFormat.Int16LE, 0))
    }

}