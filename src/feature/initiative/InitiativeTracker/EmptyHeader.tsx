import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

export function EmptyHeader() {
  return (
    <>
      <CardHeader
        title={"Initiative"}
        titleTypographyProps={{
          sx: {
            fontSize: "1.125rem",
            fontWeight: "bold",
            lineHeight: "32px",
            color: "text.primary",
          },
        }}
        sx = {{
         paddingBottom: "0px",
        }}
      />
      <Divider variant="middle" />

        <Typography
          variant="caption"
          sx={{
            px: 2,
            py: 1,
            display: "inline-block",
            color: "text.secondary",
          }}
        >
          {"Open a scene to use the initiative tracker"}
        </Typography>

    </>
  );
}
