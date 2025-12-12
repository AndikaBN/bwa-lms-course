import { createBrowserRouter, redirect } from "react-router-dom";
import SignInPage from "../pages/SignIn";
import SignUpPage from "../pages/SignUp";
import SuccesCheckoutPage from "../pages/SuccesCheckout";
import LayoutDashboard from "../components/layout";
import ManagerHomePage from "../pages/manager/home";
import ManageCoursePage from "../pages/manager/courses";
import ManageCreateCoursePage from "../pages/manager/create-courses";
import ManageCourseDetailPage from "../pages/manager/course-detail";
import ManageContentCreatePage from "../pages/manager/course-content-create";
import ManageCoursePreviewPage from "../pages/manager/course-preview";
import ManageStudentPage from "../pages/manager/student";
import StudentPage from "../pages/student/StudentOverview";
import secureLocalStorage from "react-secure-storage";
import { MANAGER_SESSION, STORAGE_KEY } from "../utils/const";
import {
  getCategories,
  getCourses,
  getCoursesDetail,
  getDetailContent,
  getStudentsCourse,
} from "../services/courseService";
import ManageStudentCreatePage from "../pages/manager/student-create";
import { getStudentDetail, getStudents } from "../services/studentService";
import ManageStudentCourseListPage from "../pages/manager/course-student-list";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ManagerHomePage />,
  },
  {
    path: "/manager/sign-in",
    element: <SignInPage />,
  },
  {
    path: "/manager/sign-up",
    element: <SignUpPage />,
  },
  {
    path: "/success-checkout",
    element: <SuccesCheckoutPage />,
  },
  {
    path: "/manager",
    id: MANAGER_SESSION,
    loader: async () => {
      const session = secureLocalStorage.getItem(STORAGE_KEY);

      if (!session || session.role !== "manager") {
        throw redirect("/manager/sign-in");
      }

      return session;
    },
    element: <LayoutDashboard />,
    children: [
      {
        index: true,
        element: <ManagerHomePage />,
      },
      {
        path: "/manager/courses",
        loader: async () => {
          const data = await getCourses();
          console.log(data);
          return data;
        },
        element: <ManageCoursePage />,
      },
      {
        path: "/manager/courses/create",
        loader: async () => {
          const categories = await getCategories();

          return { categories, course: null };
        },
        element: <ManageCreateCoursePage />,
      },
      {
        path: "/manager/courses/edit/:id",
        loader: async ({ params }) => {
          const categories = await getCategories();
          const course = await getCoursesDetail(params.id);
          console.log(course);

          return { categories, course: course?.data };
        },
        element: <ManageCreateCoursePage />,
      },
      {
        path: "/manager/courses/:id",
        loader: async ({ params }) => {
          const course = await getCoursesDetail(params.id);

          return course?.data;
        },
        element: <ManageCourseDetailPage />,
      },
      {
        path: "/manager/courses/:id/create",
        element: <ManageContentCreatePage />,
      },
      {
        path: "/manager/courses/:id/edit/:contentId",
        loader: async ({ params }) => {
          const content = await getDetailContent(params.contentId);
          return content?.data;
        },
        element: <ManageContentCreatePage />,
      },
      {
        path: "/manager/courses/:id/preview",
        loader: async ({ params }) => {
          const course = await getCoursesDetail(params.id, true);

          return course?.data;
        },
        element: <ManageCoursePreviewPage />,
      },
      {
        path: "/manager/students",
        loader: async () => {
          const studednts = await getStudents();
          return studednts?.data;
        },
        element: <ManageStudentPage />,
      },
      {
        path: "/manager/students/create",
        element: <ManageStudentCreatePage />,
      },
      {
        path: "/manager/students/edit/:id",
        loader: async ({ params }) => {
          const student = await getStudentDetail(params.id);
          return student?.data;
        },
        element: <ManageStudentCreatePage />,
      },
      {
        path: "/manager/courses/students/:id",
        loader: async ({params}) => {
          const students = await getStudentsCourse(params.id);
          return students?.data;
        },
        element: <ManageStudentCourseListPage/>
      }
    ],
  },
  {
    path: "/student",
    element: <LayoutDashboard isAdmin={false} />,
    children: [
      {
        index: true,
        element: <StudentPage />,
      },
      {
        path: "/student/detail-course/:id",
        element: <ManageCoursePreviewPage />,
      },
    ],
  },
]);

export default router;
