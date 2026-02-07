#!/usr/bin/env python3
"""
生成 NodScroll 促销磁贴 v2 - 简化版（纯英文）
Generate promotional tiles for NodScroll v2 - Simplified (English only)
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_gradient_background(width, height):
    """创建渐变背景"""
    img = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(img)

    # 深蓝到浅蓝的渐变
    for y in range(height):
        # 颜色从 #1a1a2e 到 #4a90d9
        r = int(26 + (74 - 26) * y / height)
        g = int(26 + (144 - 26) * y / height)
        b = int(46 + (217 - 46) * y / height)
        draw.line([(0, y), (width, y)], fill=(r, g, b))

    return img

def add_text_with_shadow(draw, text, position, font, text_color='#FFFFFF', shadow_offset=2):
    """添加带阴影的文字"""
    x, y = position
    # 阴影
    draw.text((x + shadow_offset, y + shadow_offset), text, fill='#000000', font=font)
    # 文字
    draw.text((x, y), text, fill=text_color, font=font)

def create_promo_tile_v2(width, height, output_path):
    """创建促销磁贴 v2"""

    # 创建渐变背景
    img = create_gradient_background(width, height)
    draw = ImageDraw.Draw(img)

    # 根据图片大小计算字体大小
    title_size = int(width * 0.12)
    subtitle_size = int(width * 0.042)
    feature_size = int(width * 0.028)

    # 加载字体
    try:
        # macOS 系统字体
        title_font = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf', title_size)
        subtitle_font = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf', subtitle_size)
        feature_font = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf', feature_size)
    except:
        try:
            title_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', title_size)
            subtitle_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', subtitle_size)
            feature_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', feature_size)
        except:
            # 备用默认字体
            title_font = ImageFont.load_default()
            subtitle_font = ImageFont.load_default()
            feature_font = ImageFont.load_default()

    center_x = width // 2

    # 主标题
    main_title = "NodScroll"
    bbox = draw.textbbox((0, 0), main_title, font=title_font)
    title_width = bbox[2] - bbox[0]
    title_height = bbox[3] - bbox[1]
    title_y = int(height * 0.25)

    add_text_with_shadow(draw, main_title,
                        (center_x - title_width // 2, title_y),
                        title_font, '#FFFFFF', shadow_offset=int(width * 0.005))

    # 副标题 1
    subtitle1 = "Exercise Your Neck"
    bbox = draw.textbbox((0, 0), subtitle1, font=subtitle_font)
    sub1_width = bbox[2] - bbox[0]
    sub1_y = title_y + title_height + int(height * 0.08)

    draw.text((center_x - sub1_width // 2, sub1_y),
              subtitle1, fill='#75d9a0', font=subtitle_font)

    # 副标题 2
    subtitle2 = "While Browsing"
    bbox = draw.textbbox((0, 0), subtitle2, font=subtitle_font)
    sub2_width = bbox[2] - bbox[0]
    sub2_y = sub1_y + int(height * 0.1)

    draw.text((center_x - sub2_width // 2, sub2_y),
              subtitle2, fill='#75d9a0', font=subtitle_font)

    # 特性标签（仅大图）
    if height > 400:
        features_y = sub2_y + int(height * 0.15)
        features = [
            "Head Gesture Control",
            "Privacy First",
            "AI Powered"
        ]

        total_width = width * 0.9
        spacing = total_width / len(features)

        for i, feature in enumerate(features):
            bbox = draw.textbbox((0, 0), feature, font=feature_font)
            feature_width = bbox[2] - bbox[0]
            feature_x = int((width - total_width) / 2 + i * spacing + spacing / 2 - feature_width / 2)

            # 特性圆角矩形背景
            padding = int(width * 0.015)
            rect_left = feature_x - padding
            rect_top = features_y - padding
            rect_right = feature_x + feature_width + padding
            rect_bottom = features_y + bbox[3] - bbox[1] + padding

            # 绘制圆角矩形（简化版）
            draw.rectangle([rect_left, rect_top, rect_right, rect_bottom],
                         fill='#2a2a4a', outline='#4a90d9', width=2)

            draw.text((feature_x, features_y), feature, fill='#FFFFFF', font=feature_font)

    # 添加装饰边框
    border_width = max(int(width * 0.01), 2)
    draw.rectangle(
        [(border_width, border_width), (width - border_width, height - border_width)],
        outline='#4a90d9',
        width=border_width
    )

    # 保存
    img.save(output_path, 'PNG', quality=95)
    print(f"✅ 已生成: {output_path}")

    return img

def main():
    """主函数"""
    print("🎨 NodScroll 促销磁贴生成器 v2")
    print("=" * 50)

    # 创建输出目录
    output_dir = "promo_tiles"
    os.makedirs(output_dir, exist_ok=True)

    # 生成小促销磁贴 (440 x 280)
    print("\n📐 生成小促销磁贴 (440 x 280)...")
    create_promo_tile_v2(
        width=440,
        height=280,
        output_path=os.path.join(output_dir, "small_promo_tile_440x280.png")
    )

    # 生成大型促销磁贴 (1400 x 560)
    print("\n📐 生成大型促销磁贴 (1400 x 560)...")
    create_promo_tile_v2(
        width=1400,
        height=560,
        output_path=os.path.join(output_dir, "large_promo_tile_1400x560.png")
    )

    print("\n" + "=" * 50)
    print("🎉 完成！促销磁贴已生成")
    print("\n📁 文件位置:")
    print(f"  - {output_dir}/small_promo_tile_440x280.png")
    print(f"  - {output_dir}/large_promo_tile_1400x560.png")
    print("\n💡 提示:")
    print("  这些是基础版本，你可以使用以下工具进一步美化：")
    print("  - Canva (https://www.canva.com) - 在线设计工具")
    print("  - Figma (https://www.figma.com) - 专业设计工具")
    print("  - 或查看 PROMO_DESIGN_GUIDE.md 获取详细设计建议")

if __name__ == "__main__":
    main()
