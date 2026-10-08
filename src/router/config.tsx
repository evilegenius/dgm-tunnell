import type { RouteObject } from "react-router-dom";
import Layout from "@/components/feature/Layout";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/home/page";
import About from "@/pages/about/page";
import Formations from "@/pages/formations/page";
import CourseDetail from "@/pages/course/page";
import Services from "@/pages/services/page";
import Projects from "@/pages/projets/page";
import SitesWeb from "@/pages/sites-web/page";
import Testimonials from "@/pages/temoignages/page";
import Blog from "@/pages/blog/page";
import BotTelegramArticle from "@/pages/blog/creer-un-bot-telegram/page";
import Contact from "@/pages/contact/page";
import Legal from "@/pages/legal/page";
import AccesPrive from "@/pages/acces-prive/page";
import AdminDashboardPage from "@/pages/acces-prive/admin/pages/DashboardPage";
import AdminCountriesConfigsPage from "@/pages/acces-prive/admin/pages/CountriesConfigsPage";
import AdminTokensPage from "@/pages/acces-prive/admin/pages/TokensPage";
import AdminDevicesPage from "@/pages/acces-prive/admin/pages/DevicesPage";
import AdminApplicationPage from "@/pages/acces-prive/admin/pages/ApplicationPage";
import AdminJournalPage from "@/pages/acces-prive/admin/pages/JournalPage";
import AdminSecurityPage from "@/pages/acces-prive/admin/pages/SecurityPage";
import Tunnel from "@/pages/tunnel/page";
import DownloadPage from "@/pages/download/page";

const routes: RouteObject[] = [
  {
    path: "/admin",
    element: <AccesPrive />,
    children: [
      {
        index: true,
        element: <AdminDashboardPage />,
      },
      {
        path: "pays-configs",
        element: <AdminCountriesConfigsPage />,
      },
      {
        path: "jetons",
        element: <AdminTokensPage />,
      },
      {
        path: "appareils",
        element: <AdminDevicesPage />,
      },
      {
        path: "application",
        element: <AdminApplicationPage />,
      },
      {
        path: "journal",
        element: <AdminJournalPage />,
      },
      {
        path: "securite",
        element: <AdminSecurityPage />,
      },
    ],
  },
  {
    path: "/app",
    element: <Tunnel />,
  },
  {
    path: "/download",
    element: <DownloadPage />,
  },
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/a-propos",
        element: <About />,
      },
      {
        path: "/formations",
        element: <Formations />,
      },
      {
        path: "/formations/:id",
        element: <CourseDetail />,
      },
      {
        path: "/services",
        element: <Services />,
      },
      {
        path: "/projets",
        element: <Projects />,
      },
      {
        path: "/sites-web",
        element: <SitesWeb />,
      },
      {
        path: "/temoignages",
        element: <Testimonials />,
      },
      {
        path: "/blog",
        element: <Blog />,
      },
      {
        path: "/blog/creer-un-bot-telegram",
        element: <BotTelegramArticle />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/mentions-legales",
        element: <Legal />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];

export default routes;