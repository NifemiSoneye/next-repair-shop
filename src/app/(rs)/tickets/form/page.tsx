import { getCustomer } from "@/lib/queries/getCustomer";
import { getTicket } from "@/lib/queries/getTicket";
import { BackButton } from "@/components/BackButton";
import * as Sentry from "@sentry/nextjs";
import TicketForm from "@/app/(rs)/tickets/form/TicketForm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Users, init as kindeInit } from "@kinde/management-api-js";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { customerId, ticketId } = await searchParams;

  if (!customerId && !ticketId)
    return { title: "Missing Ticket ID or Customer ID" };
  if (customerId) return { title: `New Ticket for Customer #${customerId}` };
  if (ticketId) return { title: `Edit Ticket #${ticketId}` };
}

export default async function TicketFormPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  let customerId: string | undefined;
  let ticketId: string | undefined;
  let isManager = false;
  let customer = null;
  let ticket = null;
  let techs: { id: string; description: string }[] = [];
  let userEmail: string | null = null;
  let isEditable = false;

  try {
    const params = await searchParams;
    customerId = params.customerId;
    ticketId = params.ticketId;

    const { getPermission, getUser } = getKindeServerSession();
    const [managerPermission, user] = await Promise.all([
      getPermission("manager"),
      getUser(),
    ]);

    isManager = managerPermission?.isGranted ?? false;
    userEmail = user?.email ?? null;

    if (customerId) {
      customer = await getCustomer(parseInt(customerId));
    }

    if (ticketId) {
      ticket = await getTicket(parseInt(ticketId));
      if (ticket) {
        customer = await getCustomer(ticket.customerId);
        isEditable = userEmail?.toLowerCase() === ticket.tech.toLowerCase();
      }
    }

    if (isManager) {
      kindeInit();
      const { users } = await Users.getUsers();
      techs = users
        ? users
            .filter(
              (user): user is { email: string } =>
                typeof user.email === "string",
            )
            .map((user) => ({
              id: user.email?.toLowerCase() ?? "",
              description: user.email?.toLowerCase() ?? "",
            }))
        : [];
    }
  } catch (e) {
    if (e instanceof Error) {
      Sentry.captureException(e);
      throw e;
    }
  }

  // Guard clauses - JSX outside try/catch
  if (!customerId && !ticketId) {
    return (
      <>
        <h2 className="text-2xl mb-2">
          Ticket ID or Customer ID required to load ticket form
        </h2>
        <BackButton title="Go Back" variant="default" />
      </>
    );
  }

  if (customerId) {
    if (!customer) {
      return (
        <>
          <h2 className="text-2xl mb-2">Customer Id #{customerId} not found</h2>
          <BackButton title="Go Back" variant="default" />
        </>
      );
    }

    if (!customer.active) {
      return (
        <>
          <h2 className="text-2xl mb-2">
            Customer Id #{customerId} is not active
          </h2>
          <BackButton title="Go Back" variant="default" />
        </>
      );
    }

    if (isManager) {
      return (
        <TicketForm customer={customer} techs={techs} isManager={isManager} />
      );
    }

    return <TicketForm customer={customer} />;
  }

  if (ticketId) {
    if (!ticket) {
      return (
        <>
          <h2 className="text-2xl mb-2">Ticket Id #{ticketId} not found</h2>
          <BackButton title="Go Back" variant="default" />
        </>
      );
    }

    if (!customer) {
      return (
        <>
          <h2 className="text-2xl mb-2">Customer not found for this ticket</h2>
          <BackButton title="Go Back" variant="default" />
        </>
      );
    }

    if (isManager) {
      return (
        <TicketForm
          customer={customer}
          techs={techs}
          ticket={ticket}
          isManager={isManager}
        />
      );
    }

    return (
      <TicketForm customer={customer} ticket={ticket} isEditable={isEditable} />
    );
  }
}
