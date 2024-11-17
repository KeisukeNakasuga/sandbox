//
// Created by keisuke on 24/11/17.
//

#include <stddef.h>
#include <stdlib.h>
#include <string.h>

char* module_d_str(char* str)
{
    char* input = " → module_d_str";

    size_t len_1 = strlen(str);
    size_t len_2 = strlen(input);

    char* result = (char*)malloc(len_1 + len_2 + 1);
    strcpy(result, str);
    strcat(result, input);

    return result;
}
