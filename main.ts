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
enum Grange {
    //% block="2G"
    two = 0,
    //% block="4G"
    four = 8,
    //% block="8G"
    eight = 16,
    //% block="16G"
    sixteen = 24
}
enum Gyrange {
    //% block="250 deg/s"
    tfty = 0,
    //% block="500 deg/s"
    fvhd = 8,
    //% block="1000 deg/s"
    onth = 16,
    //% block="2000 deg/s"
    twth = 24
}

//% color="#2244FF"
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
    let acscl = .061   //accelerometer scale
    let gyscl = 131     //gyro scale
    /**
     * reads data from the MPU-9250 IMU
     */
    export function read(register: number): number {
        pins.i2cWriteNumber(104, register, NumberFormat.UInt8BE, true)
        let data = pins.i2cReadBuffer(104, 2, false)
        return (data.getNumber(NumberFormat.Int16BE, 0))
    }
    /**
     * Reads the gyroscope and returns a value in deg/s.
     */
    //% block
    export function Gyro(axis: GyroAxis): number {
        let reading = IMU9250.read(axis)
        if (axis == 67) {
            return (Math.round((reading - xcal) / 131))
        }
        if (axis == 69) {
            return (Math.round((reading - ycal) / 131))
        }
        if (axis == 71) {
            return (Math.round((reading - zcal) / 131))
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
     * Returns the x, y, and z calibration values for the gyro.
     */
    //% color="#FF4422"
    //% block
    export function gyroCalibrationValue(axis: GyroAxis): number {
        if (axis == 67) {
            return (xcal)
        }
        if (axis == 69) {
            return (ycal)
        }
        if (axis == 70) {
            return (zcal)
        }
        else { return (0) }
    }
    /**
     * Manual input of calibration values.
     */
    //% color="#FF4422"
    //% block
    export function gyroCalibrationManualInput(x: number, y: number, z: number): void {
        xcal = x
        ycal = y
        zcal = z
    }
    /**
    * Returns the x, y, and z hard iron offset values for the magnetometer.
    */
    //% color="#FF4422"
    //% block
    export function magnitometerHardIronValue(axis: MagAxis): number {
        if (axis == 3) {
            return (xmo)
        }
        if (axis == 5) {
            return (ymo)
        }
        if (axis == 7) {
            return (zmo)
        }
        else { return (0) }
    }
    /**
     * Manual input of magnetometer hard iron offset values.
     */
    //% color="#FF4422"
    //% block
    export function magnitometerHardIronManualInput(x: number, y: number, z: number): void {
        xmo = x
        ymo = y
        zmo = z
    }
    /**
    * Returns the x, y, and z hard iron offset values for the magnetometer.
    */
    //% color="#FF4422"
    //% block
    export function magnitometerSoftIronValue(axis: MagAxis): number {
        if (axis == 3) {
            return (xms)
        }
        if (axis == 5) {
            return (yms)
        }
        if (axis == 7) {
            return (zms)
        }
        else { return (0) }
    }
    /**
     * Manual input of magnetometer soft iron offset values.
     */
    //% color="#FF4422"
    //% block
    export function magnitometerSoftIronManualInput(x: number, y: number, z: number): void {
        xms = x
        yms = y
        zms = z
    }


    /**
     * Sets the sensitivity of the accelerometer.
     */
    //% block
    export function SetAccelerometerSensitivity(sensitivity: Grange): void {
        pins.i2cWriteNumber(104, (7168 + sensitivity), NumberFormat.UInt16BE, false)
        acscl = .061 * 2 ** (sensitivity >> 3)
    }
    /**
    * Sets the sensitivity of the gyro.
    */
    //% block
    export function SetGyroSensitivity(sensitivity: Gyrange): void {
        pins.i2cWriteNumber(104, (7167 + sensitivity), NumberFormat.UInt16BE, false)
        gyscl = 131 / (2 ** (sensitivity >> 3))
    }
    /**
     * Reads the accelerometer and returns the value
     * in microgravities (1/1000th of a gravity)
     */
    //% block
    export function Accelerometer(axis: AccelAxis): number {
        let reading = IMU9250.read(axis)
        return (Math.round(reading * acscl))
    }
    /**
     * Reads the temperature of the IMU (in degrees C)
     */
    //% block
    export function Temperature(): number {
        let reading = IMU9250.read(65)
        return (reading / 321 + 19)
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
    //% duration.min=1 duration.max=120 duration.defl=10
    export function CalibrateMagnetometer(duration: number): void {
        let xmax = IMU9250.MagnetometerRaw(3)
        let xmin = IMU9250.MagnetometerRaw(3)
        let ymax = IMU9250.MagnetometerRaw(5)
        let ymin = IMU9250.MagnetometerRaw(5)
        let zmax = IMU9250.MagnetometerRaw(7)
        let zmin = IMU9250.MagnetometerRaw(7)
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
        xmo = (xmax + xmin) / 2
        ymo = (ymax + ymin) / 2
        zmo = (zmax + zmin) / 2
        let avg = ((xmax - xmin) + (ymax - ymin) + (zmax - zmin)) / 3
        xms = avg / (xmax - xmin)
        yms = avg / (ymax - ymin)
        zms = avg / (zmax - zmin)
    }
    /**
     * Reads the magnetometer.
     */
    //% block
    export function magnetometer(axis: MagAxis): number {
        let reading = IMU9250.MagnetometerRaw(axis)
        if (axis == 3) {
            return (Math.round((reading - xmo) * xms))
        }
        if (axis == 5) {
            return (Math.round((reading - ymo) * yms))
        }
        if (axis == 7) {
            return (Math.round((reading - zmo) * zms))
        }
        else { return (0) }
    }
}