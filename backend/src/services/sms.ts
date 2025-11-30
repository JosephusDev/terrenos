interface SMSProps {
  name: string;
  phone: string;
}

export async function sendSMS({ name, phone }: SMSProps) {
  const response = await fetch("https://api.useombala.ao/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OMBALA_API_KEY}`,
    },
    body: JSON.stringify({
      message: `Saudações Sr(a). ${name}, seu pedido foi aprovado. Dirija-se à Admin. Municipal do Uige.`,
      from: process.env.OMBALA_OWNER,
      to: phone,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(errorText);
    return { success: false, error: errorText };
  }
  return { success: true };
}
