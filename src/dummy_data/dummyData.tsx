// dummyData.ts
export interface Member {
  id: number;
  nim: string;
  name: string;
  faculty: string;
  campus: string;
  task: { done: boolean }[];
  attendance: { attended: boolean }[];
}

const DUMMY_MEMBERS: Member[] = [
  {
    id: 1,
    nim: 'xxx23xxx',
    name: 'Lorem Ipsum Dolor Sit Amet',
    faculty: 'xxxx',
    campus: 'Ganesha',
    task: [
      { done: true },
      { done: false },
      { done: true },
      { done: true },
      { done: false },
      { done: false },
      { done: false }
    ],
    attendance: [
      { attended: true },
      { attended: true },
      { attended: false },
      { attended: true },
      { attended: false },
      { attended: true }
    ]
  },
  {
    id: 2,
    nim: 'xxx23xxx',
    name: 'Lorem Ipsum Dolor Sit Amet',
    faculty: 'xxxx',
    campus: 'Jatinangor',
    task: [
      { done: true },
      { done: true },
      { done: true },
      { done: true },
      { done: true },
      { done: true },
      { done: true }
    ],
    attendance: [
      { attended: false },
      { attended: false },
      { attended: false },
      { attended: true },
      { attended: false },
      { attended: false }
    ]
  },
  {
    id: 3,
    nim: 'xxx23xxx',
    name: 'Lorem Ipsum Dolor Sit Amet',
    faculty: 'xxxx',
    campus: 'Cirebon',
    task: [
      { done: false },
      { done: false },
      { done: false },
      { done: false },
      { done: false },
      { done: false },
      { done: false }
    ],
    attendance: [
      { attended: true },
      { attended: true },
      { attended: true },
      { attended: true },
      { attended: true },
      { attended: true }
    ]
  }
];

export default DUMMY_MEMBERS;
