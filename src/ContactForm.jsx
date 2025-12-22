import { useState } from 'react';
import { toast } from 'react-toastify'; // Optional, if you want toast notifications
//contactform
export default function ContactForm() {
  const [result, setResult] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);
    formData.append("access_key", "9af032b1-d8f6-4973-b7a8-e42bdf7720e1"); // replace with your key

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setResult("Form Submitted Successfully");
        event.target.reset();
        toast && toast.success("Message sent successfully!"); // optional toast
      } else {
        setResult("Error submitting form");
        toast && toast.error("Failed to send message"); // optional toast
      }
    } catch (err) {
      console.error(err);
      setResult("Something went wrong!");
      toast && toast.error("Something went wrong!");
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-lg mx-auto flex flex-col gap-4">
      <input type="text" name="name" placeholder="Name" required className="border p-2 rounded" />
      <input type="email" name="email" placeholder="Email" required className="border p-2 rounded" />
      <textarea name="message" placeholder="Message" required className="border p-2 rounded"></textarea>
      <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
        Send Message
      </button>
      <span className="text-center text-gray-600">{result}</span>
    </form>
  );
}
