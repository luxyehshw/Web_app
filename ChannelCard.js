export default function ChannelCard({ channel }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
      <h4>{channel.name}</h4>
      <p>Owner: {channel.ownerId}</p>
    </div>
  );
}
