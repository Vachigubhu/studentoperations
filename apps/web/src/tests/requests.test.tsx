import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { RequestsPage } from "../pages/RequestsPage";

const mockUseRequests = vi.fn();

vi.mock("../hooks/useRequests", () => ({
  useRequests: (filters: unknown) => mockUseRequests(filters),
}));

const renderRequestsPage = () =>
  render(
    <MemoryRouter>
      <RequestsPage />
    </MemoryRouter>,
  );

describe("RequestsPage", () => {
  beforeEach(() => {
    mockUseRequests.mockReset();
  });

  it("renders the requests page and filters", () => {
    mockUseRequests.mockReturnValue({
      data: {
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      },
      isLoading: false,
      isError: false,
    });

    renderRequestsPage();

    expect(
      screen.getByRole("heading", { name: "My Requests" }),
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Search requests..."),
    ).toBeInTheDocument();

    expect(screen.getByText("All statuses")).toBeInTheDocument();
    expect(screen.getByText("All priorities")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Reset Filters" }),
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "New Request" })).toHaveAttribute(
      "href",
      "/requests/new",
    );
  });

  it("shows the loading state", () => {
    mockUseRequests.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    renderRequestsPage();

    expect(screen.getByText("Loading requests...")).toBeInTheDocument();
  });

  it("shows the empty state when there are no requests", () => {
    mockUseRequests.mockReturnValue({
      data: {
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      },
      isLoading: false,
      isError: false,
    });

    renderRequestsPage();

    expect(screen.getByText("No requests found")).toBeInTheDocument();

    expect(
      screen.getByText("Try changing your filters or create a new request."),
    ).toBeInTheDocument();
  });

  it("renders request results", () => {
    mockUseRequests.mockReturnValue({
      data: {
        data: [
          {
            _id: "request-1",
            title: "Visa Extension",
            status: "UNDER_REVIEW",
            priority: "HIGH",
            createdAt: "2026-09-20T10:00:00.000Z",
            requestType: {
              name: "Visa Extension",
              code: "VISA_EXTENSION",
            },
            department: {
              name: "International Students Office",
              code: "ISO",
            },
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      },
      isLoading: false,
      isError: false,
    });

    renderRequestsPage();

    expect(screen.getAllByText("Visa Extension")).toHaveLength(2);

    expect(
      screen.getByText("International Students Office"),
    ).toBeInTheDocument();

    expect(screen.getAllByText("UNDER REVIEW")).toHaveLength(2);

    expect(screen.getAllByText("HIGH")).toHaveLength(2);

    expect(
      screen.getByRole("link", { name: "Visa Extension" }),
    ).toHaveAttribute("href", "/requests/request-1");
  });
  it("shows the API error state", () => {
    mockUseRequests.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    renderRequestsPage();

    expect(screen.getByText("Failed to load requests.")).toBeInTheDocument();
  });

  it("updates the search filter", async () => {
    const user = userEvent.setup();

    mockUseRequests.mockReturnValue({
      data: {
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      },
      isLoading: false,
      isError: false,
    });

    renderRequestsPage();

    const searchInput = screen.getByPlaceholderText("Search requests...");

    await user.type(searchInput, "visa");

    const latestCall =
      mockUseRequests.mock.calls[mockUseRequests.mock.calls.length - 1][0];

    expect(latestCall).toMatchObject({
      search: "visa",
      page: 1,
      limit: 10,
    });
  });

  it("resets filters", async () => {
    const user = userEvent.setup();

    mockUseRequests.mockReturnValue({
      data: {
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      },
      isLoading: false,
      isError: false,
    });

    renderRequestsPage();

    const searchInput = screen.getByPlaceholderText("Search requests...");

    await user.type(searchInput, "visa");

    await user.click(
      screen.getByRole("button", {
        name: "Reset Filters",
      }),
    );

    const latestCall =
      mockUseRequests.mock.calls[mockUseRequests.mock.calls.length - 1][0];

    expect(latestCall).toMatchObject({
      search: undefined,
      status: undefined,
      priority: undefined,
      page: 1,
      limit: 10,
    });
  });
});
