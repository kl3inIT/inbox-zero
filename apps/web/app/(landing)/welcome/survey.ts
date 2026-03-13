// copy pasted from PostHog
import { USER_ROLES } from "@/utils/constants/user-roles";
import { BRAND_NAME } from "@/utils/branding";

export const survey = {
  questions: [
    {
      key: "features",
      type: "multiple_choice",
      question: "Bạn quan tâm nhất đến tính năng nào?",
      choices: [
        "Trợ lý email AI",
        "Hủy đăng ký hàng loạt",
        "Chặn email tiếp thị",
        "Theo dõi trả lời/theo dõi lại",
        "Phân tích email",
      ],
    },
    {
      key: "role",
      type: "single_choice",
      question: "Vai trò nào mô tả bạn đúng nhất?",
      choices: USER_ROLES.map((role) => role.value),
      skippable: true,
    },
    {
      key: "goal",
      type: "single_choice",
      question: `What are you looking to achieve with ${BRAND_NAME}?`,
      choices: [
        "Dọn dẹp hộp thư hiện tại",
        "Quản lý hộp thư hiệu quả hơn về sau",
        "Cả hai",
      ],
    },
    // {
    //   key: "company_size",
    //   type: "single_choice",
    //   question: "What is the size of your company?",
    //   choices: [
    //     "Only me",
    //     "2-10 people",
    //     "11-100 people",
    //     "101-1000 people",
    //     "1000+ people",
    //   ],
    //   skippable: false,
    // },
    {
      key: "source",
      type: "single_choice",
      question: `Bạn biết đến ${BRAND_NAME} từ đâu?`,
      choices: [
        "Tìm kiếm",
        "Bạn bè",
        "Twitter",
        "GitHub",
        "YouTube",
        "Reddit",
        "Facebook",
        "Bản tin email",
        "Product Hunt",
        "HackerNews",
        "TikTok",
        "Instagram",
        "Khác",
      ],
      skippable: true,
    },
    {
      key: "improvements",
      type: "open",
      question:
        "Câu hỏi cuối cùng! Nếu có một cây đũa thần, bạn muốn cải thiện điều gì trong trải nghiệm email của mình?",
    },
  ],
};
