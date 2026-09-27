import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "./shared/Layout";
import PageSkeleton from "./shared/components/PageSkeleton";

// Code-split the pages (each route becomes its own chunk)
const LandingPage = lazy(() => import("./features/Landing/pages/LandingPage"));
const ProductsPage = lazy(() => import("./features/Products/pages/ProductsPage"));


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <LandingPage />
          </Suspense>
        ),
      },
      {
        path: "/products",
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <ProductsPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
