#include <stdio.h>
#include "module_a.h"
#include "module_b.h"
#include "module_c.h"

int main(void)
{
    char* input = "START";
    char* a_str = module_a_str(input);
    char* b_str = module_b_str(a_str);
    char* c_str = module_c_str(b_str);
    printf("%s", c_str);
    return 0;
}
