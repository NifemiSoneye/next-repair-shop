import { getCustomer } from "@/lib/queries/getCustomer";
import { BackButton } from "@/components/BackButton";
import * as Sentry from "@sentry/nextjs";
import CustomerForm from "@/app/(rs)/customers/form/CustomerForm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { customerId } = await searchParams;
  if (!customerId) return { title: "New Customer" };
  return { title: `Edit Customer #${customerId}` };
}

export default async function CustomerFormPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  let isManager = false;
  let customer = null;
  let customerId: string | undefined;

  try {
    const { getPermission } = getKindeServerSession();
    const managerPermission = await getPermission("manager");
    isManager = managerPermission?.isGranted ?? false;
    const params = await searchParams;
    customerId = params.customerId;

    if (customerId) {
      customer = await getCustomer(parseInt(customerId));
    }
  } catch (e) {
    if (e instanceof Error) {
      Sentry.captureException(e);
      throw e;
    }
  }

  if (!customerId) {
    return <CustomerForm key="new" isManager={isManager} />;
  }

  if (!customer) {
    return (
      <>
        <h2 className="text-2xl mb-2">Customer Id #{customerId} not found</h2>
        <BackButton title="Go Back" variant="default" />
      </>
    );
  }

  return (
    <CustomerForm key={customerId} customer={customer} isManager={isManager} />
  );
}
