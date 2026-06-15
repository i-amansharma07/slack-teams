import { Resend } from "resend";
import { env } from "@/lib/env";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendOrgAdminInvite({
  email,
  token,
  orgName,
}: {
  email: string;
  token: string;
  orgName: string;
}) {
  const inviteUrl = `${env.NEXT_PUBLIC_APP_URL}/register?toke=${token}`;

  await resend.emails.send({
    from: "`onboarding@resend.dev`",
    to: email,
    subject: `You have been invited to manage ${orgName}`,
    html: `
      <p>You've been added as Org Admin for <strong>${orgName}</strong>.</p>
      <p>Set up your account using the link below. It expires in 7 days.</p>
      <a href="${inviteUrl}">${inviteUrl}</a>
    `,
  });
}


export async function sendMemberInvite({
  email,
  token,
  orgName,
  role,
}: {
  email: string;
  token: string;
  orgName: string;
  role: string;
}) {
  const inviteUrl = `${env.NEXT_PUBLIC_APP_URL}/register?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: `You've been invited to join ${orgName}`,
    html: `
      <p>You've been invited to join <strong>${orgName}</strong> as a <strong>${role}</strong>.</p>
      <p>Set up your account using the link below. It expires in 7 days.</p>
      <a href="${inviteUrl}">${inviteUrl}</a>
    `,
  });
}