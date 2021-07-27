##  Benchmarks

### Definition
Benchmarking is the practice of comparing business processes and performance metrics to industry bests and best practices from other companies. Dimensions typically measured are quality, time and cost.

### Explanation
Every iteration is the average of 10 readings from either the CPU or GPU. There were 10 iterations for every workshop. This experiment was made with an intel Core i5 10th CPU and a NVIDIA GeForce GTX 1050 (3 GB GDDR5) GPU.

### Results
### Gray filter
The average frame rate for the implementation in sofware is 16.42 fps (std 0.78) and 60.4 fps (std 0.54) for the implementation in hardware. Readings were fairly stable for both implementations with maximums and minimums very close to the average. This indicates that the values read are reliable to further study. The implementation in hardware is 3.75 faster than the one in software. See the following table:

![Process](../sketches/images/tablaGray.png)

### Convolution
The frame rate for the implementation in software is bigger that the previous implementation with an average frame rate of 35.35 fps (std 32) and 60.4 fps (std 0.90) for the implementation in hardware. Even though the standard deviation in software is fairly big (32 fps) this was caused by an extremely high reading of 126 fps. The rest were fairly stable. Readings were fairly stable in hardware with maximums and minimums very close to the average. The implementation in hardware is 1.75 faster than the one in software. See the following table:

![Process](../sketches/images/tablaConvolucion.png)