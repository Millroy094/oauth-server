import React, { FC, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Paper,
  Switch,
  Typography,
} from "@mui/material";
import getMFASettings from "../../../../api/get-mfa-settings";
import useFeedback from "../../../../hooks/useFeedback";

interface IMFAType {
  type: string;
  subscriber: string;
  verified: boolean;
}

const MFA: FC<{}> = () => {
  const [mfaPreference, setMfaPreference] = useState<string>("");
  const [mfaTypes, setMfaTypes] = useState<IMFAType[]>([]);
  const { feedbackAxiosError } = useFeedback();

  const fetchMFASettings = async (): Promise<void> => {
    try {
      const response = await getMFASettings();
      setMfaTypes(response.data.settings.types);
      setMfaPreference(response.data.settings.preference);
    } catch (err) {
      feedbackAxiosError(
        err,
        "There was an issue retrieving mfa setting, please try again"
      );
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    const name = e.target.value;
    if (checked) {
      setMfaPreference(name);
    }
  };

  useEffect(() => {
    fetchMFASettings();
  }, []);

  return (
    <Card elevation={0}>
      <CardHeader title="Mulit-Factor Authentication" />
      <CardContent>
        <Typography>
          You can make your login more secure by enabling 2FA for your account.
          Once enabled you will be required to through an additional step of
          verification whilst logging in.
        </Typography>
      </CardContent>
      <CardActions
        sx={{ display: "flex", justifyContent: "flex-end", padding: "10px" }}
      >
        <Grid container spacing={2}>
          {mfaTypes.map((mfaType) => (
            <Grid item key={mfaType.type}>
              <Paper
                elevation={2}
                sx={{ p: "10px", width: "230px", height: "80px" }}
              >
                <Grid
                  container
                  direction="column"
                  justifyContent="space-between"
                  height="100%"
                >
                  <Grid
                    item
                    container
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Grid item>
                      <Typography variant="body1">{`${mfaType.type.toUpperCase()} MFA`}</Typography>
                    </Grid>
                    <Grid item>
                      <Switch
                        size="small"
                        disabled={!mfaType.verified}
                        color="error"
                        value={mfaType.type}
                        checked={mfaPreference === mfaType.type}
                        onChange={onChange}
                      />
                    </Grid>
                  </Grid>
                  <Grid container item justifyContent="flex-end">
                    <Button variant="outlined" color="success" size="small">
                      {`${mfaType.verified ? "Reset" : "Setup"} MFA`}
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </CardActions>
    </Card>
  );
};

export default MFA;
