
## Conclusions

- The spatial coherence approach allows obtaining a representation of an image or frame at a lower resolution for subsequent processing
- Hardware image processing gets better performance and user experience compared to software processing.
- The barycentric coordinates algorithm is used by the gpu shaders, so the interpolation of the attributes of a texture are transparent to the user.


## Future work
Image processing is an important branch that can demand a lot of computer power. 
however the use of parallel processing by gpu improves performance considerably. In this section future work on each topic covered before is explored.

Firstly, in image grayscaling, work focused on developing algorithms with good results could be expected, such as Gamma correction with lower computational costs. An important question would be how to implement it through glsl shaders 

Finally, The spatial coherence approach could reduce the training time for convolutional networks, therefore it would be of interest to carry out studies to know to what extent this technique is functional





