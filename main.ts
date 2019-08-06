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
    // initialize globals
    let xcal = 0    //gyro calibration
    let ycal = 0
    let zcal = 0
    let xmo = 0     //magnetometer offset
    let ymo = 0
    let zmo = 0
    let xms = 1     //magnetometer scale
    let yms = 1
    let zms = 1
    /**
     * reads data from the MPU-9250 IMU
     */
    export function read(register: number): number {
        pins.i2cWriteNumber(104, register, NumberFormat.UInt8BE, true)
        let data = pins.i2cReadBuffer(104, 2, false)
        return (data.getNumber(NumberFormat.Int16BE, 0))
    }
    /**
     * debugging function for magnetometer
     */
    //% block
    export function readmagmode(): number {
        pins.i2cWriteNumber(12, 10, NumberFormat.UInt8BE, true)
        let data = pins.i2cReadBuffer(12, 1, false)
        return (data.getNumber(NumberFormat.UInt8BE, 0))
    }
    /**
     * Reads the gyroscope and returns a value in deg/s.
     */
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
    /**
     * Calibrates the gyroscope for accurate readings.
     * The IMU must remain perfectly motionless during
     * the calibration process.
     */
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
    /**
     * Reads the accelerometer and returns the value
     * in microgravities (1/1000th of a gravity)
     */
    //% block
    export function Accelerometer(axis: AccelAxis): number {
        let reading = IMU9250.read(axis)
        return (reading * .061)
    }
    /**
     * Reads the temperature of the IMU (in degrees C)
     */
    //% block
    export function Temperature(): number {
        let reading = IMU9250.read(65)
        return ((reading - 1023) / 321 + 21)
    }
    /**
     * This block enables communication with the magnetomoeter 
     * and puts it in continuous read mode. It is necessary to 
     * run this block at least once before using the magnetometer.
     */
    //% block
    export function EnableMagnetometer(): void {
        pins.i2cWriteNumber(104, 55, NumberFormat.UInt8BE, true)
        let state = pins.i2cReadNumber(104, NumberFormat.UInt8BE, false)
        let stateswitch = state | 2
        pins.i2cWriteNumber(104, (14080 + stateswitch), NumberFormat.UInt16BE, false)
        basic.pause(10)
        pins.i2cWriteNumber(12, 2582, NumberFormat.UInt16BE, false)
    }
    /**
     * Reads the magnetomoter and returns raw data.
     */
    export function MagnetometerRaw(axis: MagAxis): number {
        pins.i2cWriteNumber(12, axis, NumberFormat.UInt8BE, true)
        let data = pins.i2cReadBuffer(12, 2, false)
        pins.i2cWriteNumber(12, 9, NumberFormat.UInt8BE, true)
        pins.i2cReadNumber(12, NumberFormat.UInt8BE, false)
        return (data.getNumber(NumberFormat.Int16LE, 0))
    }
    /**
     * To calibrate the magnetometer every axis needs to be
     * pointed in every possible orientation. While it is running
     * rotate the IMU around as much as possible. More data will
     * yield better results, the duration of the data calibration
     * process can be set (in seconds).
     */
    //% block
    export function CalibrateMagnetometer(duration: number): void {
        let xmax = 0
        let xmin = 0
        let ymax = 0
        let ymin = 0
        let zmax = 0
        let zmin = 0
        let x = 0
        let y = 0
        let z = 0
        let start = input.runningTime()
        while (input.runningTime() - start <= duration * 1000) {
            x = IMU9250.MagnetometerRaw(3)
            y = IMU9250.MagnetometerRaw(5)
            z = IMU9250.MagnetometerRaw(7)
            xmax = Math.max(xmax, x)
            xmin = Math.min(xmin, x)
            ymax = Math.max(ymax, y)
            ymin = Math.min(ymin, y)
            zmax = Math.max(zmax, z)
            zmin = Math.min(zmin, z)
        }
        xmo = (xmax - xmin) / 2
        ymo = (ymax - ymin) / 2
        zmo = (zmax - zmin) / 2
        let avg = (xmo + ymo + zmo) / 3
        xms = avg / xmo
        yms = avg / ymo
        zms = avg / zmo
    }
    /**
     * Reads the magnetometer.
     */
    //% block
    export function magnetometer(axis: MagAxis): number {
        let reading = IMU9250.MagnetometerRaw(axis)
        if (axis == 3) {
            return ((reading - xmo) * xms)
        }
        if (axis == 5) {
            return ((reading - ymo) * yms)
        }
        if (axis == 7) {
            return ((reading - zmo) * zms)
        }
        else { return (0) }
    }
}