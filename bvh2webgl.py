def parse_bvh(file_path):
    with open(file_path, 'r') as file:
        content = file.readlines()

    # 파싱 상태를 추적
    reading_hierarchy = True
    hierarchy = []
    motions = []

    # 임시 데이터 저장을 위한 변수
    current_joint = None
    joint_stack = []

    # 파일을 한 줄씩 읽으면서 처리
    for line in content:
        stripped_line = line.strip()
        if stripped_line == "MOTION":
            reading_hierarchy = False
            continue

        if reading_hierarchy:
            if "ROOT" in stripped_line or "JOINT" in stripped_line:
                joint_name = stripped_line.split()[-1]
                current_joint = {
                    "name": joint_name,
                    "channels": [],
                    "children": []
                }
                if joint_stack:
                    joint_stack[-1]["children"].append(current_joint)
                joint_stack.append(current_joint)
                hierarchy.append(current_joint)  # ROOT 추가
            elif (("}" in stripped_line) and len(joint_stack) > 0):
                joint_stack.pop()
            elif "OFFSET" in stripped_line:
                _, x, y, z = stripped_line.split()
                current_joint["offset"] = (float(x), float(y), float(z))
            elif "CHANNELS" in stripped_line:
                channels_info = stripped_line.split()
                current_joint["channels"] = channels_info[2:]
        else:  # Motion 데이터 읽기
            if "Frames:" in stripped_line:
                num_frames = int(stripped_line.split()[1])
            elif "Frame Time:" in stripped_line:
                frame_time = float(stripped_line.split()[2])
            else:
                frame_data = list(map(float, stripped_line.split()))
                motions.append(frame_data)

    return hierarchy, motions

# BVH 파일 경로 지정
file_path = './bvh/Copy of ROM_001_JumpOnBox.bvh'
hierarchy, motions = parse_bvh(file_path)

print(hierarchy)
print(motions)

