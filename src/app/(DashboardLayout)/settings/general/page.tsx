"use client";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import useSWR, { mutate } from "swr";
import axios from "@/lib/axios";
import { ListData, Setting } from "@/type/api";
import humanizeString from "humanize-string";
import moment from "moment";
import { IconPencil } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import CustomButton from "../../components/shared/CustomButton";
import { Controller, useForm } from "react-hook-form";
import CustomTextField from "../../components/forms/theme-elements/CustomTextField";
import CustomSelect from "../../components/forms/theme-elements/CustomSelect";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import CustomSnackbar from "../../components/forms/theme-elements/CustomSnackbar";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import PageHeader, { PageMeta } from "../../components/shared/PageHeader";

interface FormData {
  value: any;
}

interface SelectableValue {
  key: string;
  value: any;
}

interface DialogSetting extends Setting {
  title?: string;
}

const schema = yup.object().shape({
  value: yup.mixed().required(),
});

const PageMeta: PageMeta = {
  title: "General Settings",
  description: "Setup general settings for your app",
  breadcrumb: [
    {
      text: "Settings",
    },
    {
      text: "General Settings",
      href: "/settings/general",
    },
  ],
  image: "/images/header/general-settings.svg",
};

const GeneralSettingsPage = () => {
  const [open, setOpen] = useState(false);
  const [dialogData, setDialogData] = useState<DialogSetting | null>(null);
  useState<SelectableValue[]>();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      value: dialogData?.value,
    },
  });

  const handleClickOpen = (setting: Setting) => {
    setOpen(true);

    const dialogSetting: DialogSetting = setting;
    dialogSetting.title = humanizeString(setting.key);

    let selectable = setting.selectable;
    if (setting.key === "date-format" || setting.key === "time-format") {
      const updatedSelectable = selectable.map((item: SelectableValue) => ({
        ...item,
        value: moment().format(item.key),
      }));
      dialogSetting.selectable = updatedSelectable;
    }

    setDialogData(dialogSetting);
  };

  const handleClose = () => {
    setOpen(false);
    setValue("value", "");
    setDialogData(null);
  };

  useEffect(() => {
    setValue("value", dialogData?.value);
  }, [dialogData]);

  const onSubmitHandler = async (data: FormData) => {
    try {
      axios
        .put(`/settings/${dialogData?.id}`, { value: data.value })
        .then((res) => {
          mutate("/settings");
          enqueueSnackbar(
            `${humanizeString(
              dialogData?.key ?? ""
            )} has been updated successfully`,
            {
              variant: "success",
              anchorOrigin: { horizontal: "right", vertical: "bottom" },
            }
          );
          setOpen(false);
          return res.data;
        })
        .catch((err) => err);
    } catch (e) {
      console.log(e);
    }
  };

  const { data, error, isLoading } = useSWR<ListData<Setting>>(
    "/settings",
    () =>
      axios
        .get("/settings", { params: { sort: "key", order: "asc" } })
        .then((res) => {
          return res.data;
        })
        .catch((err) => err)
  );

  if (error) return <div>failed to load</div>;
  if (isLoading)
    return (
      <PageContainer title={PageMeta.title} description={PageMeta.description}>
        <PageHeader
          title={PageMeta.title}
          breadcrumb={PageMeta.breadcrumb}
          image={PageMeta.image}
        />
        <DashboardCard title={PageMeta.title}>
          <Grid container spacing={2}>
            {Array.from({ length: 3 }, (_, index) => (
              <Grid item xs={4} key={index}>
                <Skeleton sx={{ marginBottom: 1 }} />
                <Skeleton sx={{ marginBottom: 1 }} />
                <Skeleton />
              </Grid>
            ))}
          </Grid>
        </DashboardCard>
      </PageContainer>
    );

  return (
    <PageContainer title={PageMeta.title} description={PageMeta.description}>
      <PageHeader
        title={PageMeta.title}
        breadcrumb={PageMeta.breadcrumb}
        image={PageMeta.image}
      />
      <DashboardCard>
        <Box sx={{ overflow: "auto", width: { xs: "280px", sm: "auto" } }}>
          <Table
            aria-label="general settings table"
            sx={{
              whiteSpace: "nowrap",
              mt: 2,
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Key
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Value
                  </Typography>
                </TableCell>
                <TableCell size="small" align="center">
                  <Typography variant="subtitle2" fontWeight={600}>
                    Action
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.data.map((setting) => (
                <TableRow key={setting.key}>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {humanizeString(setting.key)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {(() => {
                        switch (setting.key) {
                          case "date-format":
                            return moment().format(setting.value);

                          case "time-format":
                            return moment().format(setting.value);
                          default:
                            return setting.value;
                        }
                      })()}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      aria-label="Edit value"
                      onClick={() => {
                        handleClickOpen(setting);
                      }}
                    >
                      <IconPencil />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </DashboardCard>

      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <DialogTitle>{dialogData?.title}</DialogTitle>
          <DialogContent dividers sx={{ width: { xs: "280px", sm: "500px" } }}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="value"
              mb="5px"
            >
              Value
            </Typography>
            {dialogData?.selectable === null ? (
              <Controller
                name="value"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    type="text"
                    variant="outlined"
                    fullWidth
                    {...field}
                  />
                )}
              />
            ) : (
              <Controller
                name="value"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <Select
                      labelId="setting-value"
                      id="setting-value"
                      label="Value"
                      input={<CustomSelect />}
                      {...field}
                    >
                      {dialogData?.selectable?.map((value: SelectableValue) => (
                        <MenuItem key={value.key} value={value.key}>
                          {value.value}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            )}
            {errors.value && (
              <Typography
                variant="subtitle1"
                fontWeight={600}
                component="label"
                mb="5px"
                color={"error"}
              >
                Error when submitting form. Please try again.
              </Typography>
            )}
          </DialogContent>
          <DialogActions
            sx={{
              padding: 3,
            }}
          >
            <Button onClick={handleClose}>Cancel</Button>
            <CustomButton variant="contained" disableElevation type="submit">
              Update
            </CustomButton>
          </DialogActions>
        </form>
      </Dialog>

      <SnackbarProvider
        Components={{
          success: CustomSnackbar,
          error: CustomSnackbar,
        }}
      />
    </PageContainer>
  );
};

export default GeneralSettingsPage;
