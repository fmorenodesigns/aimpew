import "./styles.scss";

export default function DonateButton() {
  return (
    <form action="https://www.paypal.com/donate" method="post" target="_blank">
      <input type="hidden" name="hosted_button_id" value="N3YF6SV6UX5SU" />
      <span
        data-tooltip="Hey there! 👋 I like making games in my spare time, but this is not my full-time occupation. Here's a PayPal donation button if you want to show appreciation."
        className="tooltip--top"
      >
        <button className="donate-button" type="submit">
          I want to support this game
        </button>
      </span>
    </form>
  );
}
