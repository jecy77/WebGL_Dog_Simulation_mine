# 파일 읽기 함수.
def read_file(read_file_path):
    f = open(read_file_path, 'r', encoding='utf-8')
    lines = f.readlines()
    f.close()
    return lines

# 파일 쓰기 함수
def write_file(write_file_path, lines):
    f = open(write_file_path, 'w', encoding='utf-8')
    for line in lines:
        f.write(line)
    f.close()

# 파일 내용 수정하는 함수.
def modify_file(read_file_path, write_file_path, arrs):
    lines = read_file(read_file_path)

    f = open(write_file_path, 'w', encoding='utf-8')
    for line in lines:
        for arr in arrs:
            find_string, new_string = arr[0], arr[1]
            if find_string in line:
                line = new_string+"\n"
        f.write(line)
    f.close()
