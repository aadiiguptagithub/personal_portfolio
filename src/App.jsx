import { BrowserRouter, Routes, Route } from "react-router-dom";
import { About, Experience, Feedbacks, Hero, Navbar, Tech, Works, StarsCanvas, Footer, AdminLogin, AdminDashboard, Login, Register, BlogList, BlogDetail, AboutUs, ContactUs, Work, BlogProvider, WorkProvider } from "./components";
import { HomeProvider } from "./components/context/HomeContext";

const MainLayout = () => (
  <div className='relative z-0 bg-primary'>
    <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
      <Navbar />
      <Hero />
    </div>
    <About />
    <Experience />
    <Tech />
    <Works />
    <Feedbacks />
    <div className='relative z-0'>
      <StarsCanvas />
    </div>
    <Footer />
  </div>
);

const BlogLayout = ({ children }) => (
  <div className="relative z-0 bg-primary min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

const App = () => {
  // Example demo projects for Work page (replace with real data/backend connection)
  const demoProjects = [
    {
      id: 1,
      title: "Portfolio Website",
      description: "A modern, interactive portfolio built with React, Three.js, and Tailwind CSS.",
      techStack: "React, Three.js, Tailwind",
      date: "2025-07-01",
      image: "/project1.jpg",
      demoLink: "#"
    },
    {
      id: 2,
      title: "E-commerce Platform",
      description: "A scalable e-commerce platform with real-time analytics and admin dashboard.",
      techStack: "Node.js, MongoDB, React",
      date: "2025-06-15",
      image: "/project2.jpg",
      demoLink: "#"
    },
    // ...more demo projects
  ];
  return (
    <HomeProvider>
      <BlogProvider>
        <WorkProvider>
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />} />
            <Route path="/about-us" element={<BlogLayout><AboutUs /></BlogLayout>} />
            <Route path="/contact-us" element={<BlogLayout><ContactUs /></BlogLayout>} />
            <Route path="/work" element={<BlogLayout><Work /></BlogLayout>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/blog" element={<BlogLayout><BlogList /></BlogLayout>} />
            <Route path="/blog/:id" element={<BlogLayout><BlogDetail /></BlogLayout>} />
          </Routes>
          </BrowserRouter>
        </WorkProvider>
      </BlogProvider>
    </HomeProvider>
  );
}

export default App;