#include "adder.h"
#include <stdio.h>
#include "xor.h"

void adder(unsigned int a, unsigned int b, unsigned int cin, unsigned int *out, unsigned int *cout)
{
    unsigned int _out = 0x0;
    unsigned int _cout = 0x0;

    _out = XOR(XOR(a, b), cin);
    _cout = (a & b) | (a & cin) | (b & cin);

    *out = _out;
    *cout = _cout;
}

void adder_7(unsigned int a, unsigned int b, unsigned int *out, unsigned int *carry)
{
    unsigned int _out = 0x0;

    unsigned int tmp_out = 0x0;
    unsigned int tmp_carry = 0x0;
    for (size_t i = 0; i < 7; i++)
    {
        adder((a >> i) & 0x1, (b >> i) & 0x1, tmp_carry, &tmp_out, &tmp_carry);
        _out |= (tmp_out << i);
    }

    *out = _out;
    *carry = tmp_carry;
}

void adder_16(unsigned int a, unsigned int b, unsigned int *out, unsigned int *carry)
{
    unsigned int _out = 0x0;

    unsigned int tmp_out = 0x0;
    unsigned int tmp_carry = 0x0;
    for (size_t i = 0; i < 16; i++)
    {
        adder((a >> i) & 0x1, (b >> i) & 0x1, tmp_carry, &tmp_out, &tmp_carry);
        _out |= (tmp_out << i);
    }

    *out = _out;
    *carry = tmp_carry;
}

