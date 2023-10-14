
unsigned int get_state_from_state_id(unsigned int state_id)
{
    switch (state_id)
    {
    case 0b000:
        return 0;
    case 0b001:
        return 1;
    case 0b010:
        return 2;
    case 0b011:
        return 6;
    case 0b100:
        return 7;
    case 0b101:
        return 9;
    case 0b110:
        return 10;
    case 0b111:
        return 11;

    default:
        break;
    }

    return 0;
}