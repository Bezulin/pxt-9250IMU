enum Axis {
    //% block = "x axis"
    x = 0
    //% block = "y axis"
    y=2
    //% block = "z axis"
    z=4
}

//% color="#AA11FF"
namespace IMU{
    /**
     * reads data from a MPU-9250 IMU
     */
    //% block = "Read Gyro"
    export function readGyro(axis:Axis):number{
        pins.i2cWriteNumber(104, 67+axis, NumberFormat.Int8LE,true)
        return(pins.i2cReadBuffer(104, 2))
    }
}