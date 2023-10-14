#include <stdio.h>

unsigned int XOR(unsigned int a, unsigned int b)
{
    return a ^ b;
}

unsigned int XOR_16(unsigned int a, unsigned int b)
{
    unsigned int _out = 0x0;
    for (size_t i = 0; i < 16; i++)
    {
        _out = _out | XOR((a >> i) & 0x1, (b >> i) & 0x1) << i;
    }

    return _out;
}