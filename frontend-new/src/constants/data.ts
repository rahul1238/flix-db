import { NavItem } from '@/types';

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};

export const users: User[] = [
  {
    id: 1,
    name: 'Candice Schiner',
    company: 'Dell',
    role: 'Frontend Developer',
    verified: false,
    status: 'Active'
  },
  {
    id: 2,
    name: 'John Doe',
    company: 'TechCorp',
    role: 'Backend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    company: 'WebTech',
    role: 'UI Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 4,
    name: 'David Smith',
    company: 'Innovate Inc.',
    role: 'Fullstack Developer',
    verified: false,
    status: 'Inactive'
  },
  {
    id: 5,
    name: 'Emma Wilson',
    company: 'TechGuru',
    role: 'Product Manager',
    verified: true,
    status: 'Active'
  },
  {
    id: 6,
    name: 'James Brown',
    company: 'CodeGenius',
    role: 'QA Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 7,
    name: 'Laura White',
    company: 'SoftWorks',
    role: 'UX Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 8,
    name: 'Michael Lee',
    company: 'DevCraft',
    role: 'DevOps Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 9,
    name: 'Olivia Green',
    company: 'WebSolutions',
    role: 'Frontend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 10,
    name: 'Robert Taylor',
    company: 'DataTech',
    role: 'Data Analyst',
    verified: false,
    status: 'Active'
  }
];

export const navItems: NavItem[] = [
  {
    title: 'Home',
    href: '/dashboard',
    icon: 'home',
    label: 'Home'
  },
  {
    title: 'Movies',
    href: '/dashboard/movies',
    icon: 'popcorn',
    label: 'Movies'
  },
  {
    title: 'Logout',
    href: '/',
    icon: 'logout',
    label: 'Logout'
  }
];
export const movies = [
  {
    "id": 1112,
    "title": "Grand Masti",
    "description": " Lipsum dolor sit amet, consectetur adipiscing elit",
    "genre": "Good",
    "images": [
      "https://cataas.com/cat?seed=2342",
      "https://cataas.com/cat?sdfas=1231",
      "https://cataas.com/cat",
      "https://cataas.com/cat",
      "https://cataas.com/cat"
    ],
    "origin": ""
  },
  {
    "id": 1434354312,
    "title": "Kabir Singh",
    "description": " Lipsum dolor sit amet, consectetur adipiscing elit",
    "genre": "Good",
    "images": [
      "https://cataas.com/cat?seed=23412312",
      "https://cataas.com/cat?sdfas=123231",
      "https://cataas.com/cat",
      "https://cataas.com/cat",
      "https://cataas.com/cat"
    ],
    "origin": ""
  },
  {
    "id": 4312,
    "title": "Animal",
    "description": " Lipsum dolor sit amet, consectetur adipiscing elit",
    "genre": "Good",
    "images": [
      "https://cataas.com/cat?seed=2234342",
      "https://cataas.com/cat?sdfas=1231",
      "https://cataas.com/cat",
    ],
    "origin": ""
  },
  {
    "id": 131232432,
    "title": "Grand Masti 2",
    "description": " Lipsum dolor sit amet, consectetur adipiscing elit",
    "genre": "Good",
    "images": [
      "https://cataas.com/cat?s123eed=2342",
      "https://cataas.com/cat?sdfas=12311231",
      "https://cataas.com/cat",
      "https://cataas.com/cat",
      "https://cataas.com/cat"
    ],
    "origin": ""
  }
]
