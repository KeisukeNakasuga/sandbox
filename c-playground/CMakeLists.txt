cmake_minimum_required(VERSION 3.29)
project(c_playground C)

set(CMAKE_C_STANDARD 23)

add_executable(c_playground
        src/main.c
        src/module_a.c
        src/module_b.c
        src/module_c.c
        src/module_d.c)
