// components/PaginationNav.tsx
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { useLocation, useNavigate } from "react-router-dom";

const pages = [
  { name: "Dashboard", path: "/" },
  { name: "Cases", path: "/cases" },
  { name: "Evidence", path: "/evidence" },
  { name: "Reports", path: "/reports" },
  { name: "Settings", path: "/settings" },
];

export default function PaginationNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentIndex = pages.findIndex((page) => page.path === location.pathname);


  const goToPage = (index: number) => {
    if (index >= 0 && index < pages.length) {
      navigate(pages[index].path);
    }
  };

  return (
    <div className="flex justify-end mb-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink
              onClick={() => goToPage(currentIndex - 1)}
              className={currentIndex === 0 ? "opacity-50 pointer-events-none" : "cursor-pointer"}
            >
              Prev
            </PaginationLink>
          </PaginationItem>
          {pages.map((page, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                isActive={location.pathname === page.path}
                onClick={() => goToPage(i)}
                className="cursor-pointer"
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationLink
              onClick={() => goToPage(currentIndex + 1)}
              className={currentIndex === pages.length - 1 ? "opacity-50 pointer-events-none" : "cursor-pointer"}
            >
              Next
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
