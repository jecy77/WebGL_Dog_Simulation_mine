#-*- coding: utf-8 -*-

import os
import json
import shutil
import file_io as fio

def bvh_to_webgl():
    file_names = [ 'Copy of ROM_001_JumpOnBox.bvh',
                'Copy of ROM_0010_WalkTurnPlusShake.bvh',
                'Copy of ROM_0011_WalkTurnsAndScrabbleOntoBox.bvh',
                'Copy of ROM_008_WalkAndShake.bvh'
                ]
    
        
    read_file_path = "./bvh/"
    write_file_path = "./bvh_webgl_version/"

    contents = {}

    try:
        for key, arrs in contents.items():
            fio.modify_file(read_file_path+key, write_file_path+key, arrs)
    except BaseException as e:
        print("Error: ", e)
    print("Code modify complete")

if __name__ == "__main__": # 메인 코드
    bvh_to_webgl()