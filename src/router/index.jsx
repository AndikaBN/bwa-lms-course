import { createBrowserRouter } from "react-router-dom";
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
    element: <LayoutDashboard />,
    children: [
      {
        index: true,
        element: <ManagerHomePage />,
      },
      {
        path: "/manager/courses",
        element: <ManageCoursePage />,
      },
      {
        path: "/manager/courses/create",
        element: <ManageCreateCoursePage />,
      },
      {
        path: "/manager/courses/:id",
        element: <ManageCourseDetailPage />,
      },
      {
        path: "/manager/courses/:id/create",
        element: <ManageContentCreatePage />,
      },
      {
        path: "/manager/courses/:id/preview",
        element: <ManageCoursePreviewPage />,
      },
      {
        path: "/manager/students",
        element: <ManageStudentPage />,
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
      }
    ]
  }
]);

export default router;
