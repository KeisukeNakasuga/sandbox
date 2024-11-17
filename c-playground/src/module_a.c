//
// Created by keisuke on 24/11/17.
//

#include <stddef.h>
#include <stdlib.h>
#include <string.h>

#include "module_d.h"

char* module_a_str(char* str)
{
    char* input = " → module_a_str";
    char* str_d = module_d_str(str);

    size_t len_1 = strlen(str_d);
    size_t len_2 = strlen(input);

    char* result = (char*)malloc(len_1 + len_2 + 1);
    strcpy(result, str_d);
    strcat(result, input);

    return result;
}