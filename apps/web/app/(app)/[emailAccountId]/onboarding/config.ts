import {
  RocketIcon,
  BriefcaseIcon,
  StoreIcon,
  CodeIcon,
  CalendarDaysIcon,
  TrendingUpIcon,
  PhoneIcon,
  MegaphoneIcon,
  HeadphonesIcon,
  HomeIcon,
  VideoIcon,
  UsersIcon,
  ShoppingCartIcon,
  GraduationCapIcon,
  UserIcon,
  CircleHelpIcon,
  type LucideIcon,
} from "lucide-react";

export const usersRolesInfo: Record<
  string,
  {
    icon: LucideIcon;
    suggestedLabels: { label: string; description: string }[];
  }
> = {
  Founder: {
    icon: RocketIcon,
    suggestedLabels: [
      {
        label: "Phản hồi khách hàng",
        description: "Ý kiến, góp ý và phản hồi mà khách hàng gửi cho chúng ta",
      },
      {
        label: "Nhà đầu tư",
        description: "Trao đổi từ các nhà đầu tư và quỹ đầu tư",
      },
      {
        label: "Khẩn cấp",
        description: "Email cần xử lý ngay hoặc trong thời gian rất gấp",
      },
    ],
  },
  Executive: {
    icon: BriefcaseIcon,
    suggestedLabels: [
      {
        label: "Hội đồng quản trị",
        description: "Họp HĐQT, tài liệu và trao đổi với các thành viên HĐQT",
      },
      {
        label: "Đối tác/khách hàng quan trọng",
        description:
          "Đối tác then chốt, khách hàng lớn và các trao đổi quan trọng",
      },
    ],
  },
  "Small Business Owner": {
    icon: StoreIcon,
    suggestedLabels: [
      {
        label: "Phản hồi khách hàng",
        description: "Góp ý và phản hồi từ khách hàng về sản phẩm/dịch vụ",
      },
      {
        label: "Khẩn cấp",
        description: "Email cần xử lý ngay hoặc trong thời gian rất gấp",
      },
    ],
  },
  "Software Engineer": {
    icon: CodeIcon,
    suggestedLabels: [
      {
        label: "Cảnh báo",
        description: "Lỗi hệ thống, cảnh báo server và thông báo triển khai",
      },
      {
        label: "GitHub",
        description: "Pull request và đánh giá code",
      },
      {
        label: "Bug",
        description: "Báo lỗi và theo dõi issue",
      },
      {
        label: "Bảo mật",
        description: "Lỗ hổng bảo mật và cập nhật liên quan",
      },
    ],
  },
  Assistant: {
    icon: CalendarDaysIcon,
    suggestedLabels: [
      {
        label: "Lên lịch họp",
        description: "Email cần được xếp lịch cuộc họp",
      },
      {
        label: "Công tác/di chuyển",
        description: "Đặt vé, lịch trình và sắp xếp chuyến đi",
      },
    ],
  },
  Investor: {
    icon: TrendingUpIcon,
    suggestedLabels: [
      {
        label: "Cập nhật công ty",
        description: "Báo cáo tiến độ từ các công ty trong danh mục đầu tư",
      },
      {
        label: "Pitch Deck",
        description: "Slide giới thiệu, cơ hội đầu tư mới",
      },
      {
        label: "Nhà đầu tư góp vốn (LP)",
        description: "Trao đổi với các Limited Partner",
      },
      {
        label: "Thẩm định (Due Diligence)",
        description: "Nghiên cứu và phân tích cơ hội đầu tư",
      },
    ],
  },
  Sales: {
    icon: PhoneIcon,
    suggestedLabels: [
      {
        label: "Khách hàng tiềm năng",
        description: "Cơ hội mới và khách hàng đang được chăm sóc",
      },
      {
        label: "Khách hàng hiện tại",
        description: "Trao đổi với các khách hàng đang sử dụng dịch vụ",
      },
      {
        label: "Thương vụ đang trao đổi",
        description: "Đàm phán và đề xuất báo giá",
      },
      {
        label: "Nguy cơ rời bỏ",
        description: "Khách hàng có dấu hiệu muốn dừng dịch vụ",
      },
    ],
  },
  Marketing: {
    icon: MegaphoneIcon,
    suggestedLabels: [
      {
        label: "Chiến dịch",
        description: "Chiến dịch marketing và các hoạt động truyền thông",
      },
      {
        label: "Duyệt nội dung",
        description: "Bản nháp nội dung cần góp ý hoặc phê duyệt",
      },
      {
        label: "Báo cáo chỉ số",
        description: "Số liệu hiệu quả và báo cáo phân tích marketing",
      },
      {
        label: "Đối tác/Agency",
        description: "Trao đổi với agency và các đối tác marketing",
      },
    ],
  },
  "Customer Support": {
    icon: HeadphonesIcon,
    suggestedLabels: [
      {
        label: "Yêu cầu hỗ trợ",
        description: "Khách hàng cần hỗ trợ về sản phẩm/dịch vụ",
      },
      {
        label: "Báo lỗi",
        description: "Khách hàng báo lỗi sản phẩm",
      },
      {
        label: "Đề xuất tính năng",
        description: "Gợi ý tính năng mới từ khách hàng",
      },
    ],
  },
  Realtor: {
    icon: HomeIcon,
    suggestedLabels: [
      {
        label: "Khách mua tiềm năng",
        description: "Người mua quan tâm và hỏi thêm về bất động sản",
      },
      {
        label: "Chủ nhà/bên bán",
        description: "Chủ sở hữu muốn bán bất động sản",
      },
      {
        label: "Yêu cầu xem nhà",
        description: "Yêu cầu đặt lịch xem bất động sản",
      },
      {
        label: "Hoàn tất giao dịch",
        description: "Hồ sơ và trao đổi giai đoạn chốt giao dịch",
      },
    ],
  },
  "Content Creator": {
    icon: VideoIcon,
    suggestedLabels: [
      {
        label: "Tài trợ",
        description: "Đề nghị tài trợ và hợp đồng với thương hiệu",
      },
      {
        label: "Hợp tác",
        description: "Lời mời collab từ các creator khác",
      },
      {
        label: "Thỏa thuận thương hiệu",
        description: "Cơ hội hợp tác dài hạn với nhãn hàng",
      },
      {
        label: "Báo chí/Truyền thông",
        description: "Phỏng vấn, bài báo và yêu cầu từ báo chí",
      },
    ],
  },
  Consultant: {
    icon: UsersIcon,
    suggestedLabels: [
      {
        label: "Dự án khách hàng",
        description: "Các dự án đang triển khai và cập nhật tiến độ",
      },
      {
        label: "Đề xuất/Proposal",
        description: "Đề xuất hợp tác và phản hồi RFP",
      },
      {
        label: "Mối quan hệ nghề nghiệp",
        description: "Liên hệ trong ngành và cơ hội kết nối",
      },
    ],
  },
  "E-commerce": { icon: ShoppingCartIcon, suggestedLabels: [] },
  Student: {
    icon: GraduationCapIcon,
    suggestedLabels: [
      {
        label: "Trường/Lớp",
        description: "Email từ giảng viên và nhà trường",
      },
      {
        label: "Bài tập",
        description: "Bài tập, dự án và hạn nộp",
      },
      {
        label: "Thực tập",
        description: "Cơ hội thực tập và hồ sơ ứng tuyển",
      },
      {
        label: "Tài liệu học tập",
        description: "Giáo trình, ghi chú và tài liệu học",
      },
    ],
  },
  Individual: { icon: UserIcon, suggestedLabels: [] },
  Other: { icon: CircleHelpIcon, suggestedLabels: [] },
};
