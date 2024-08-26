import { AxiosError, AxiosResponse } from 'axios';
import { useSnackbar, VariantType } from 'notistack';

const useFeedback = (): {
  feedbackAxiosError: (error: any, defaultMessage: string) => void;
  feebackAxiosResponse: (
    response: AxiosResponse,
    defaultMessage: string,
    type: VariantType,
  ) => void;
} => {
  const { enqueueSnackbar } = useSnackbar();

  const feedbackAxiosError = (error: any, defaultMessage: string): void => {
    const feedbackMessage =
      error instanceof AxiosError && error?.response?.data?.error
        ? error.response.data.error
        : defaultMessage;

    enqueueSnackbar(feedbackMessage, { variant: 'error' });
  };

  const feebackAxiosResponse = (
    response: AxiosResponse,
    defaultMessage: string,
    type: VariantType,
  ): void => {
    enqueueSnackbar(response?.data?.message ?? defaultMessage, {
      variant: type,
    });
  };

  return { feebackAxiosResponse, feedbackAxiosError };
};

export default useFeedback;
