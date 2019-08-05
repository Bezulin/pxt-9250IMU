enum Axis {
    //% block = "x axis"
    x = 0
    //% block = "y axis"
    y=2
    //% block = "z axis"
    z=4
}

namespace IMU{
    /**
     * reads data from a MPU-9250 IMU
     */
    export function readGyro(axis:Axis):number{
        pins.i2cWriteNumber(104, 67+axis, NumberFormat.Int8LE,true)
        pins.i2cReadBuffer(104, 2)
    }
}